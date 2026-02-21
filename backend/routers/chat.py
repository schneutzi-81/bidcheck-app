import time
import logging
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from pydantic import BaseModel

from database import get_session
from models import Project
from services.retrieval import retrieve_chunks
from services.generation import answer_question

logger = logging.getLogger(__name__)
router = APIRouter()

SLOW_RESPONSE_THRESHOLD_MS = 15000


class ChatRequest(BaseModel):
    question: str


class Citation(BaseModel):
    doc_name: str
    page: int
    snippet: str


class ChatResponse(BaseModel):
    answer: str
    citations: list[Citation]
    response_time_ms: int


@router.post("/projects/{project_id}/chat", response_model=ChatResponse)
def chat(
    project_id: int,
    body: ChatRequest,
    session: Session = Depends(get_session),
):
    project = session.get(Project, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    start = time.time()

    try:
        chunks = retrieve_chunks(project_id, body.question, top_k=5)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    result = answer_question(body.question, chunks, project.language)

    elapsed_ms = int((time.time() - start) * 1000)

    if elapsed_ms > SLOW_RESPONSE_THRESHOLD_MS:
        logger.warning(
            f"Slow chat response for project {project_id}: {elapsed_ms}ms"
        )

    return ChatResponse(
        answer=result["answer"],
        citations=[Citation(**c) for c in result["citations"]],
        response_time_ms=elapsed_ms,
    )

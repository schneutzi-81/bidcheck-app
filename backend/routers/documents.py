import os
import logging
from datetime import datetime
from typing import List
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, BackgroundTasks
from sqlmodel import Session, select
from pydantic import BaseModel
import aiofiles

from database import get_session
from models import Document, Project
from config import settings
from services.ingestion import extract_text_with_pages, chunk_pages, build_index

logger = logging.getLogger(__name__)
router = APIRouter()

MAX_DOCUMENTS = 4
ALLOWED_CONTENT_TYPES = {"application/pdf"}


# ---------- Response model ----------

class DocumentResponse(BaseModel):
    id: int
    project_id: int
    filename: str
    original_name: str
    page_count: int
    status: str
    created_at: datetime


# ---------- Background ingestion ----------

def _run_ingestion(doc_id: int, pdf_path: str, original_name: str, project_id: int):
    """Run extract → chunk → index and update document status."""
    from database import get_session as _get_session
    from sqlmodel import Session
    from database import engine

    with Session(engine) as session:
        doc = session.get(Document, doc_id)
        if not doc:
            return
        try:
            pages = extract_text_with_pages(pdf_path)
            chunks = chunk_pages(pages)
            build_index(project_id, chunks, original_name)
            doc.page_count = max((p["page"] for p in pages), default=0)
            doc.status = "ready"
        except Exception as e:
            logger.error(f"Ingestion failed for doc {doc_id}: {e}")
            doc.status = "error"
        session.add(doc)
        session.commit()


# ---------- Endpoints ----------

@router.post("/projects/{project_id}/documents", response_model=DocumentResponse, status_code=201)
async def upload_document(
    project_id: int,
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    session: Session = Depends(get_session),
):
    if not session.get(Project, project_id):
        raise HTTPException(status_code=404, detail="Project not found")

    # Validate file type
    if file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")

    # Enforce max 4 documents per project
    existing = session.exec(
        select(Document).where(Document.project_id == project_id)
    ).all()
    if len(existing) >= MAX_DOCUMENTS:
        raise HTTPException(
            status_code=400,
            detail=f"Maximum {MAX_DOCUMENTS} documents per project reached",
        )

    # Save file to storage
    os.makedirs(settings.storage_path, exist_ok=True)
    stored_filename = f"{project_id}_{file.filename}"
    file_path = os.path.join(settings.storage_path, stored_filename)

    async with aiofiles.open(file_path, "wb") as f:
        content = await file.read()
        await f.write(content)

    # Create Document record
    doc = Document(
        project_id=project_id,
        filename=stored_filename,
        original_name=file.filename,
        status="processing",
    )
    session.add(doc)
    session.commit()
    session.refresh(doc)

    # Run ingestion in background
    background_tasks.add_task(
        _run_ingestion, doc.id, file_path, file.filename, project_id
    )

    return DocumentResponse(**doc.model_dump())


@router.get("/projects/{project_id}/documents", response_model=List[DocumentResponse])
def list_documents(project_id: int, session: Session = Depends(get_session)):
    if not session.get(Project, project_id):
        raise HTTPException(status_code=404, detail="Project not found")
    docs = session.exec(
        select(Document).where(Document.project_id == project_id)
    ).all()
    return [DocumentResponse(**d.model_dump()) for d in docs]


@router.delete("/projects/{project_id}/documents/{doc_id}", status_code=204)
def delete_document(
    project_id: int,
    doc_id: int,
    session: Session = Depends(get_session),
):
    doc = session.get(Document, doc_id)
    if not doc or doc.project_id != project_id:
        raise HTTPException(status_code=404, detail="Document not found")

    # Remove file from storage
    file_path = os.path.join(settings.storage_path, doc.filename)
    if os.path.exists(file_path):
        os.remove(file_path)

    session.delete(doc)
    session.commit()

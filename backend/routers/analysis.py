import logging
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session

from database import get_session
from models import Project
from services.retrieval import retrieve_chunks
from services.generation import run_analysis

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/projects/{project_id}")


def _get_project_or_404(project_id: int, session: Session) -> Project:
    project = session.get(Project, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


def _get_context(project_id: int, query: str, top_k: int) -> str:
    """Retrieve chunks and format as a context string for prompts."""
    try:
        chunks = retrieve_chunks(project_id, query, top_k=top_k)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    parts = []
    for chunk in chunks:
        parts.append(
            f"[SOURCE: {chunk['doc_name']}, page {chunk['page']}]\n{chunk['text']}"
        )
    return "\n\n---\n\n".join(parts)


# ---------- Gaps ----------

@router.post("/gaps")
def get_gaps(project_id: int, session: Session = Depends(get_session)):
    project = _get_project_or_404(project_id, session)
    context = _get_context(project_id, "requirements scope deliverables obligations", top_k=15)
    result = run_analysis("gaps", context, project.language)
    return result


# ---------- Risks ----------

@router.post("/risks")
def get_risks(project_id: int, session: Session = Depends(get_session)):
    project = _get_project_or_404(project_id, session)
    context = _get_context(project_id, "risks penalties liabilities compliance obligations SLA", top_k=15)
    result = run_analysis("risks", context, project.language)
    return result


# ---------- SOW ----------

@router.post("/sow")
def get_sow(project_id: int, session: Session = Depends(get_session)):
    project = _get_project_or_404(project_id, session)
    # SOW needs maximum context coverage across the full document
    context = _get_context(project_id, "scope work packages deliverables timeline milestones assumptions", top_k=20)
    result = run_analysis("sow", context, project.language)
    return result


# ---------- Summary ----------

@router.post("/summary")
def get_summary(project_id: int, session: Session = Depends(get_session)):
    project = _get_project_or_404(project_id, session)

    # Pull a broad context and also inline gaps + risks for the summary prompt
    rfp_context = _get_context(project_id, "scope requirements risks pricing delivery timeline", top_k=15)

    # Run gaps and risks internally to enrich the summary context
    gaps_result = run_analysis("gaps", rfp_context, project.language)
    risks_result = run_analysis("risks", rfp_context, project.language)

    import json
    combined_context = (
        f"=== RFP EXCERPTS ===\n{rfp_context}\n\n"
        f"=== GAP ANALYSIS ===\n{json.dumps(gaps_result, ensure_ascii=False, indent=2)}\n\n"
        f"=== RISK ANALYSIS ===\n{json.dumps(risks_result, ensure_ascii=False, indent=2)}"
    )

    result = run_analysis("summary", combined_context, project.language)
    return result

import shutil
import os
from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from pydantic import BaseModel

from database import get_session
from models import Customer, Project, Document
from config import settings

router = APIRouter()


# ---------- Response models ----------

class CustomerResponse(BaseModel):
    id: int
    name: str
    created_at: datetime


class ProjectResponse(BaseModel):
    id: int
    customer_id: int
    name: str
    language: str
    created_at: datetime


class CustomerWithProjects(BaseModel):
    id: int
    name: str
    created_at: datetime
    projects: List[ProjectResponse]


class DocumentResponse(BaseModel):
    id: int
    project_id: int
    filename: str
    original_name: str
    page_count: int
    status: str
    created_at: datetime


class ProjectWithDocuments(BaseModel):
    id: int
    customer_id: int
    name: str
    language: str
    created_at: datetime
    documents: List[DocumentResponse]


# ---------- Request models ----------

class CustomerCreate(BaseModel):
    name: str


class ProjectCreate(BaseModel):
    name: str
    language: str = "EN"


# ---------- Customers ----------

@router.post("/customers", response_model=CustomerResponse, status_code=201)
def create_customer(body: CustomerCreate, session: Session = Depends(get_session)):
    customer = Customer(name=body.name)
    session.add(customer)
    session.commit()
    session.refresh(customer)
    return CustomerResponse(**customer.model_dump())


@router.get("/customers", response_model=List[CustomerResponse])
def list_customers(session: Session = Depends(get_session)):
    customers = session.exec(select(Customer)).all()
    return [CustomerResponse(**c.model_dump()) for c in customers]


@router.get("/customers/{customer_id}", response_model=CustomerWithProjects)
def get_customer(customer_id: int, session: Session = Depends(get_session)):
    customer = session.get(Customer, customer_id)
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    projects = session.exec(
        select(Project).where(Project.customer_id == customer_id)
    ).all()
    return CustomerWithProjects(
        **customer.model_dump(),
        projects=[ProjectResponse(**p.model_dump()) for p in projects],
    )


# ---------- Projects ----------

@router.post("/customers/{customer_id}/projects", response_model=ProjectResponse, status_code=201)
def create_project(
    customer_id: int,
    body: ProjectCreate,
    session: Session = Depends(get_session),
):
    if not session.get(Customer, customer_id):
        raise HTTPException(status_code=404, detail="Customer not found")
    if body.language not in ("DE", "EN"):
        raise HTTPException(status_code=400, detail="language must be 'DE' or 'EN'")
    project = Project(customer_id=customer_id, name=body.name, language=body.language)
    session.add(project)
    session.commit()
    session.refresh(project)
    return ProjectResponse(**project.model_dump())


@router.get("/projects/{project_id}", response_model=ProjectWithDocuments)
def get_project(project_id: int, session: Session = Depends(get_session)):
    project = session.get(Project, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    documents = session.exec(
        select(Document).where(Document.project_id == project_id)
    ).all()
    return ProjectWithDocuments(
        **project.model_dump(),
        documents=[DocumentResponse(**d.model_dump()) for d in documents],
    )


@router.delete("/projects/{project_id}", status_code=204)
def delete_project(project_id: int, session: Session = Depends(get_session)):
    project = session.get(Project, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    # Delete document files from storage
    documents = session.exec(
        select(Document).where(Document.project_id == project_id)
    ).all()
    for doc in documents:
        file_path = os.path.join(settings.storage_path, doc.filename)
        if os.path.exists(file_path):
            os.remove(file_path)
        session.delete(doc)

    # Delete vector index folder
    index_dir = os.path.join(settings.indexes_path, str(project_id))
    if os.path.exists(index_dir):
        shutil.rmtree(index_dir)

    session.delete(project)
    session.commit()

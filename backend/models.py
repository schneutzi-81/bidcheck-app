from datetime import datetime
from typing import Optional
from sqlmodel import Field, SQLModel


class Customer(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    created_at: datetime = Field(default_factory=datetime.utcnow)


class Project(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    customer_id: int = Field(foreign_key="customer.id")
    name: str
    language: str = Field(default="EN")  # "DE" or "EN"
    created_at: datetime = Field(default_factory=datetime.utcnow)


class Document(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    project_id: int = Field(foreign_key="project.id")
    filename: str        # stored filename on disk
    original_name: str   # original upload filename
    page_count: int = Field(default=0)
    status: str = Field(default="uploading")  # uploading | processing | ready | error
    created_at: datetime = Field(default_factory=datetime.utcnow)

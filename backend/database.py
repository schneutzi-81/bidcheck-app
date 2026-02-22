from sqlmodel import SQLModel, Session, create_engine
from config import settings

engine = create_engine(
    f"sqlite:///{settings.database_url}",
    connect_args={"check_same_thread": False},
)


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)


def get_session():
    with Session(engine) as session:
        yield session

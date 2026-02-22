from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()


class Settings(BaseSettings):
    azure_openai_endpoint: str
    azure_openai_api_key: str
    azure_openai_api_version: str = "2024-08-01-preview"
    azure_openai_deployment_gpt4o: str = "gpt-4o"
    azure_openai_deployment_embedding: str = "text-embedding-3-large"
    database_url: str = "./bidcheck.db"
    storage_path: str = "./storage"
    indexes_path: str = "./indexes"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()

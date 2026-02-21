import os
from llama_index.core import StorageContext, load_index_from_storage
from llama_index.embeddings.azure_openai import AzureOpenAIEmbedding
from llama_index.core import Settings

from config import settings as app_settings


def _get_embed_model():
    return AzureOpenAIEmbedding(
        model="text-embedding-3-large",
        deployment_name=app_settings.azure_openai_deployment_embedding,
        api_key=app_settings.azure_openai_api_key,
        azure_endpoint=app_settings.azure_openai_endpoint,
        api_version=app_settings.azure_openai_api_version,
    )


def retrieve_chunks(project_id: int, query: str, top_k: int = 5) -> list[dict]:
    """Query the per-project vector index and return cited chunks."""
    index_dir = os.path.join(app_settings.indexes_path, str(project_id))

    if not os.path.exists(index_dir) or not os.listdir(index_dir):
        raise ValueError("No documents uploaded for this project")

    Settings.embed_model = _get_embed_model()
    Settings.llm = None

    storage_context = StorageContext.from_defaults(persist_dir=index_dir)
    index = load_index_from_storage(storage_context)

    retriever = index.as_retriever(similarity_top_k=top_k)
    results = retriever.retrieve(query)

    chunks = []
    for node in results:
        chunks.append({
            "text": node.node.text,
            "doc_name": node.node.metadata.get("doc_name", "unknown"),
            "page": node.node.metadata.get("page", 0),
            "score": round(float(node.score or 0), 4),
        })
    return chunks

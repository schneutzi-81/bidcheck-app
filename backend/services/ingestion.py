import os
import uuid
import fitz  # PyMuPDF
from llama_index.core import VectorStoreIndex, StorageContext, load_index_from_storage
from llama_index.core.schema import TextNode
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


def extract_text_with_pages(pdf_path: str) -> list[dict]:
    """Extract text per page from a PDF. Returns list of {page, text, doc_name}."""
    doc_name = os.path.basename(pdf_path)
    pages = []
    with fitz.open(pdf_path) as pdf:
        for page_num in range(len(pdf)):
            text = pdf[page_num].get_text("text").strip()
            if text:
                pages.append({
                    "page": page_num + 1,
                    "text": text,
                    "doc_name": doc_name,
                })
    return pages


def chunk_pages(pages: list[dict], chunk_size: int = 900) -> list[dict]:
    """Sliding window chunker over page text. Returns list of {text, doc_name, page, chunk_id}."""
    chunks = []
    for page in pages:
        text = page["text"]
        doc_name = page["doc_name"]
        page_num = page["page"]
        words = text.split()
        idx = 0
        chunk_idx = 0
        while idx < len(words):
            chunk_words = words[idx: idx + chunk_size]
            chunk_text = " ".join(chunk_words)
            chunks.append({
                "text": chunk_text,
                "doc_name": doc_name,
                "page": page_num,
                "chunk_id": f"{doc_name}_p{page_num}_c{chunk_idx}",
            })
            idx += chunk_size
            chunk_idx += 1
    return chunks


def build_index(project_id: int, chunks: list[dict], doc_name: str) -> None:
    """Build or update the per-project LlamaIndex vector store."""
    Settings.embed_model = _get_embed_model()
    Settings.llm = None  # ingestion only — no LLM needed

    index_dir = os.path.join(app_settings.indexes_path, str(project_id))

    new_nodes = [
        TextNode(
            text=chunk["text"],
            id_=str(uuid.uuid4()),
            metadata={
                "doc_name": chunk["doc_name"],
                "page": chunk["page"],
                "chunk_id": chunk["chunk_id"],
            },
        )
        for chunk in chunks
    ]

    if os.path.exists(index_dir) and os.listdir(index_dir):
        # Load existing index, remove stale nodes for this doc, add fresh ones
        storage_context = StorageContext.from_defaults(persist_dir=index_dir)
        index = load_index_from_storage(storage_context)
        docstore = index.storage_context.docstore
        stale_ids = [
            node_id
            for node_id, node in docstore.docs.items()
            if node.metadata.get("doc_name") == doc_name
        ]
        for node_id in stale_ids:
            index.delete_nodes([node_id])
        index.insert_nodes(new_nodes)
    else:
        os.makedirs(index_dir, exist_ok=True)
        index = VectorStoreIndex(new_nodes)

    index.storage_context.persist(persist_dir=index_dir)

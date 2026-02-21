# Known Limitations — BidCheck Prototype

This document lists the known limitations of the current prototype build.
These are not bugs — they are deliberate scope decisions for the initial sprint.

---

## Infrastructure

| Area | Limitation |
|------|-----------|
| **Database** | SQLite — single-file, not suitable for concurrent multi-user access. Replace with PostgreSQL for production. |
| **Storage** | PDF files and vector indexes are stored on the local filesystem. Not portable across servers or containers without a shared volume / object storage (e.g. Azure Blob). |
| **Auth** | No authentication or authorisation. Any user can read or delete any project. |
| **CORS** | Backend allows all origins (`*`). Restrict to your frontend domain before production deployment. |

---

## AI / RAG Pipeline

| Area | Limitation |
|------|-----------|
| **Token limits** | Very large RFPs (200+ pages) may exceed GPT-4o context limits during analysis. The retrieval step mitigates this but does not eliminate it. |
| **Language detection** | Language (DE / EN) is a manual project setting, not auto-detected from the document. |
| **Hallucinations** | GPT-4o may generate plausible-sounding but incorrect information. All AI outputs should be reviewed by a human before use. |
| **Citation accuracy** | Page numbers in citations are best-effort based on PyMuPDF page extraction. Scanned PDFs or PDFs with unusual encoding may produce degraded results. |
| **Structured output** | Analysis endpoints parse GPT-4o JSON output with simple string cleaning. Occasional malformed responses will surface as an `error` field in the API response rather than a hard failure. |
| **Embedding model** | Uses `text-embedding-3-large`. The index is rebuilt incrementally on each upload; re-uploading the same document replaces its nodes but does not compact the index. |
| **Rate limits** | No retry logic or backoff for Azure OpenAI rate-limit errors (HTTP 429). Add exponential backoff before production use. |

---

## Documents

| Area | Limitation |
|------|-----------|
| **File types** | Only PDF files are accepted. Word (.docx) and Excel (.xlsx) support from the original UI concept is not yet implemented in the backend. |
| **Max documents** | 4 documents per project (enforced by the API). |
| **Max file size** | No server-side file-size limit is enforced beyond the default FastAPI / Uvicorn request size. |
| **Password-protected PDFs** | Will fail text extraction silently and produce an empty document in the index. |
| **Scanned PDFs** | OCR is not performed. Text-less (image-only) pages are skipped. |

---

## Frontend

| Area | Limitation |
|------|-----------|
| **State persistence** | Page refresh loses all in-memory state. No project list / history view is implemented. |
| **Project switcher** | Only one project can be active per browser session. |
| **Error recovery** | API errors show a message but the user must retry manually; no automatic retry logic. |
| **Mobile** | Layout is designed for desktop (1280px+). Mobile viewports are functional but not optimised. |

---

## Pricing Calculator

| Area | Limitation |
|------|-----------|
| **Currency** | Output is unlabelled — the currency depends on what the user enters (EUR assumed in tests). |
| **Effort model** | Three-point estimate (low / base / high) with a flat risk buffer. Does not model non-linear risk profiles or opportunity-specific adjustments. |

---

## Operational

| Area | Limitation |
|------|-----------|
| **Logging** | No structured logging or log aggregation. Errors print to stdout only. |
| **Health monitoring** | `GET /health` returns `{"status": "ok"}` but does not check database connectivity, Azure reachability, or disk space. |
| **Backups** | No backup strategy for SQLite or uploaded files. |
| **Deployment** | No Dockerfile or IaC provided. Deployment is manual. |

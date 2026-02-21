# BidCheck - Quick Validation

A Go/No-Go decision support tool for bid qualification at SoftwareOne.

![BidCheck Screenshot](docs/screenshot.png)

## Features

- **38 Decision Criteria** across 6 categories:
  - Exclusion Criteria (8 fields) - Any "No" = Automatic NO-GO
  - Win Probability (7 fields) - 30% weight
  - Delivery Capability (6 fields) - 25% weight
  - Commercial Viability (5 fields) - 20% weight
  - Strategic Alignment (3 fields) - 15% weight
  - Proposal Feasibility (4 fields) - 10% weight

- **RFP Document Upload & AI Analysis**
  - Drag & drop PDF, Word, Excel files
  - Automatic requirement extraction
  - AI-powered criterion evaluation
  - Source evidence with page references

- **Evidence Review Panel**
  - View exact quotes from RFP documents
  - See page numbers and section context
  - Confirm or reject AI suggestions
  - Add your own comments

- **Smart Scoring**
  - Real-time weighted score calculation
  - Visual category breakdown
  - GO / CONDITIONAL GO / REVIEW REQUIRED / NO-GO recommendations

- **Role-Based Filtering**
  - Filter by: Sales, Presales, Delivery, Finance, Legal, Sales Leader
  - AI-automatable field highlighting

## Quick Start

### Prerequisites

- Node.js 18+
- Python 3.10+
- Azure OpenAI resource with:
  - GPT-4o deployment
  - text-embedding-3-large deployment

### 1 — Backend

```bash
cd backend

# Copy and fill in your Azure credentials
cp .env.example .env
# Edit .env with your AZURE_OPENAI_ENDPOINT, AZURE_OPENAI_API_KEY, etc.

# Install Python dependencies
pip install -r requirements.txt

# Start the API server (port 8000)
uvicorn main:app --reload
```

API docs available at `http://localhost:8000/docs`

### 2 — Frontend

```bash
# From the repo root
npm install

# Start dev server (uses backend at http://localhost:8000 by default)
npm run dev
```

App available at `http://localhost:5173`

### 3 — End-to-End Test (optional)

```bash
cd backend
python test_e2e.py /path/to/sample.pdf
```

Runs the full pipeline: create project → upload PDF → poll ready → Q&A + analysis → pricing → cleanup.

### Build for Production

```bash
npm run build          # Frontend → dist/
uvicorn main:app       # Backend — no --reload in production
```

---

## Project Structure

```
bidcheck/
├── src/
│   ├── App.jsx               # Main application + Go/No-Go scoring
│   ├── api/client.js         # Fetch-based API client
│   └── components/
│       ├── ProjectSetup.jsx  # Customer + project creation form
│       └── AnalysisPanel.jsx # 6-tab AI analysis panel
├── backend/
│   ├── main.py               # FastAPI entry point + CORS
│   ├── config.py             # Settings (pydantic-settings)
│   ├── models.py             # SQLModel DB tables
│   ├── database.py           # SQLite engine + session dep
│   ├── requirements.txt
│   ├── .env.example
│   ├── test_e2e.py           # End-to-end test script
│   ├── routers/
│   │   ├── projects.py       # Customer + Project CRUD
│   │   ├── documents.py      # PDF upload + status
│   │   ├── chat.py           # Cited Q&A
│   │   ├── analysis.py       # Gaps / Risks / SOW / Summary
│   │   └── pricing.py        # 3-scenario pricing calculator
│   ├── services/
│   │   ├── ingestion.py      # PyMuPDF → chunks → LlamaIndex
│   │   ├── retrieval.py      # Vector similarity search
│   │   └── generation.py     # GPT-4o generation + JSON parsing
│   └── prompts/
│       ├── gaps_en.txt / gaps_de.txt
│       ├── risks_en.txt / risks_de.txt
│       ├── sow_en.txt / sow_de.txt
│       └── summary_en.txt / summary_de.txt
├── public/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── LIMITATIONS.md
```

## Configuration

### Scoring Weights

Edit the `CATEGORY_WEIGHTS` object in `src/App.jsx`:

```javascript
const CATEGORY_WEIGHTS = {
  exclusion: 0,           // Binary pass/fail
  winProbability: 0.30,   // 30%
  deliveryCapability: 0.25, // 25%
  commercialViability: 0.20, // 20%
  strategicAlignment: 0.15, // 15%
  proposalFeasibility: 0.10 // 10%
};
```

### Adding/Modifying Criteria

Edit the `FIELDS` object in `src/App.jsx` to add or modify criteria:

```javascript
{
  id: 'uniqueFieldId',
  label: 'Field Label',
  description: 'Question to answer?',
  owner: 'Sales', // Sales, Presales, Delivery, Finance, Legal, Sales Leader
  aiSource: 'Data Source',
  aiPotential: 'high', // high, medium, low
  weight: 2 // Scoring weight within category
}
```

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

## Roadmap

### Prototype Sprint — Backend + AI Pipeline

- [x] **TASK 0** — Audit existing project structure
- [x] **TASK 1** — Scaffold Python FastAPI backend (`backend/` folder, routers, services, prompts)
- [x] **TASK 2** — Install dependencies (`requirements.txt`) and configure Azure OpenAI environment variables
- [x] **TASK 3** — Database models (Customer, Project, Document) + SQLite setup + `GET /health`
- [x] **TASK 4** — Customer and Project CRUD API (create, list, get, delete with cleanup)
- [x] **TASK 5** — PDF upload and ingestion pipeline (PyMuPDF → chunking → embeddings → LlamaIndex per-project vector store)
- [x] **TASK 6** — Cited Q&A endpoint (`POST /projects/{id}/chat`) — answers strictly from uploaded docs with `[SOURCE: filename, page N]` citations
- [x] **TASK 7** — Prompt templates (DE + EN) for gap detection, risk analysis, SOW drafting, and business case summary
- [x] **TASK 8** — Analysis endpoints: `/gaps`, `/risks`, `/sow`, `/summary` — all backed by GPT-4o + retrieved context
- [x] **TASK 9** — Pricing calculation endpoint (pure Python, 3 scenarios: low / base / high with risk buffer)
- [x] **TASK 10** — Connect React frontend to backend API (`src/api/client.js`, replace mock data, loading + error states)
- [x] **TASK 11** — End-to-end test script (`backend/test_e2e.py`) — full pipeline with a real PDF
- [x] **TASK 12** — Final cleanup: `README.md`, `LIMITATIONS.md`, `.gitignore`

### Stack for Prototype
- Backend: Python FastAPI + SQLModel + SQLite
- AI: Azure OpenAI GPT-4o (generation) + text-embedding-3-large (embeddings)
- RAG: LlamaIndex (local vector store, per-project)
- Languages: DE and EN (all outputs preserve source language)

### Post-Prototype Backlog

- [ ] PDF export of SOW and business case summary
- [ ] User authentication
- [ ] Approval workflow
- [ ] PostgreSQL (replace SQLite for multi-user)
- [ ] Retry logic and rate limit handling for Azure OpenAI
- [ ] CRM integration (Salesforce)
- [ ] HR system integration (certifications)
- [ ] Resource planner integration

## License

Internal use only - SoftwareOne

## Contributing

1. Create a feature branch
2. Make your changes
3. Submit a pull request

## Support

Contact the Presales team for questions or issues.

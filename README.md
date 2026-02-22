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

## Installation

### Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| Node.js | 18+ | https://nodejs.org |
| Python | 3.10+ | https://python.org |
| pip | any | `python -m ensurepip` |
| Azure OpenAI | — | GPT-4o + text-embedding-3-large deployments required |

### Step 1 — Clone

```bash
git clone https://github.com/schneutzi-81/bidcheck-app.git
cd bidcheck-app
```

### Step 2 — Backend

```bash
cd backend

# 1. Copy the example env file and fill in your Azure credentials
cp .env.example .env
```

Edit `backend/.env`:

```ini
AZURE_OPENAI_ENDPOINT=https://<your-resource>.openai.azure.com/
AZURE_OPENAI_API_KEY=<your-api-key>
AZURE_OPENAI_API_VERSION=2024-08-01-preview
AZURE_OPENAI_DEPLOYMENT_GPT4O=gpt-4o
AZURE_OPENAI_DEPLOYMENT_EMBEDDING=text-embedding-3-large
DATABASE_URL=./bidcheck.db
STORAGE_PATH=./storage
INDEXES_PATH=./indexes
```

```bash
# 2. Install Python dependencies
pip install -r requirements.txt

# 3. Start the API server
uvicorn main:app --reload
```

API available at `http://localhost:8000`
Interactive docs at `http://localhost:8000/docs`

### Step 3 — Frontend

```bash
# From the repo root (not backend/)
npm install
npm run dev
```

App available at `http://localhost:5173`

### Step 4 — Verify (optional)

```bash
cd backend
python test_e2e.py /path/to/any-rfp.pdf
```

Runs the full pipeline: health → create project → upload PDF → poll ready → Q&A + analysis + pricing → cleanup.
AI steps (chat, gaps, risks, SOW, summary) require valid Azure credentials.

---

## Deploy to Azure

### Option A — One-time manual deploy (`./deploy.sh`)

Uses the [Azure Developer CLI](https://learn.microsoft.com/azure/developer/azure-developer-cli/install-azd) to provision all resources and deploy in a single command.

**Prerequisites:**

```bash
# Install azd
winget install microsoft.azd          # Windows
brew install azure/azd/azd            # macOS
curl -fsSL https://aka.ms/install-azd.sh | bash  # Linux

# Log in
az login
azd auth login
```

**Deploy:**

```bash
./deploy.sh
```

What it provisions automatically:

| Resource | Purpose |
|---|---|
| Azure OpenAI (S0) | GPT-4o + text-embedding-3-large |
| Azure Container Registry | Stores the backend Docker image |
| Azure Container Apps | Runs the FastAPI backend |
| Azure Files (5 GiB) | Persistent storage for SQLite + vector indexes |
| Azure Static Web Apps | Hosts the React frontend (free tier, global CDN) |

No credential copy-paste — Bicep wires the OpenAI API key directly into the Container App as a secret.

**Tear down:**

```bash
azd down
```

---

### Option B — Automated CI/CD (Azure Pipelines)

Every push to `main` runs: test → build Docker image → deploy backend + frontend automatically.

#### One-time setup in Azure DevOps

**1. Create a Service Connection**

`Project Settings → Service connections → New → Azure Resource Manager`
- Name it exactly: `AzureServiceConnection`
- Scope: your Azure subscription (grant access to the resource group)

**2. Add Pipeline Variables**

`Pipelines → your pipeline → Edit → Variables`

| Variable | Example value | Secret? |
|---|---|---|
| `AZURE_RESOURCE_GROUP` | `rg-bidcheck-dev` | No |
| `ACR_NAME` | `cr<token>` (your ACR name without `.azurecr.io`) | No |
| `CONTAINER_APP_NAME` | `backend` | No |
| `BACKEND_URL` | `https://backend.<region>.azurecontainerapps.io` | No |
| `SWA_DEPLOYMENT_TOKEN` | _(from SWA → Manage deployment token)_ | **Yes** |

**3. Create the pipeline**

`Pipelines → New pipeline → GitHub → select repo → Existing Azure Pipelines YAML → azure-pipelines.yml`

#### What the pipeline does

```
Push to main
  │
  ├─ Stage 1: Test
  │     └─ Start backend, generate test PDF, run structural e2e
  │
  ├─ Stage 2: Build  (parallel)
  │     ├─ Docker image → pushed to ACR  (tagged with git SHA)
  │     └─ npm run build (VITE_API_URL injected) → artifact uploaded
  │
  └─ Stage 3: Deploy
        ├─ az containerapp update → new image live in Container Apps
        └─ Azure Static Web Apps deploy task → frontend live
```

---

## Project Structure

```
bidcheck/
├── azure-pipelines.yml       # CI/CD: test → build → deploy (Azure DevOps)
├── azure.yaml                # azd project manifest
├── deploy.sh                 # One-command manual deploy (azd up wrapper)
├── staticwebapp.config.json  # SPA routing fallback for Static Web Apps
├── infra/
│   ├── main.bicep            # Subscription-scoped Bicep orchestration
│   ├── main.bicepparam       # azd environment parameter bindings
│   ├── abbreviations.json    # Resource naming prefixes
│   └── core/
│       ├── ai/cognitiveservices.bicep    # Azure OpenAI + model deployments
│       ├── host/containerapp.bicep       # Container Apps + Azure Files volume
│       ├── host/staticwebapp.bicep       # Static Web App (frontend)
│       ├── storage/storageaccount.bicep  # Azure Files share (SQLite + indexes)
│       └── security/registry.bicep       # Azure Container Registry
├── src/
│   ├── App.jsx               # Main application + Go/No-Go scoring
│   ├── api/client.js         # Fetch-based API client
│   └── components/
│       ├── ProjectSetup.jsx  # Customer + project creation form
│       └── AnalysisPanel.jsx # 6-tab AI analysis panel
├── backend/
│   ├── Dockerfile            # Multi-stage Python 3.12 image
│   ├── .env.example          # Environment variable template
│   ├── main.py               # FastAPI entry point + CORS
│   ├── config.py             # Settings (pydantic-settings)
│   ├── models.py             # SQLModel DB tables
│   ├── database.py           # SQLite engine + session dep
│   ├── requirements.txt
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

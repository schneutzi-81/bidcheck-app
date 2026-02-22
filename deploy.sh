#!/usr/bin/env bash
# BidCheck — One-command Azure deployment
# Usage: ./deploy.sh
#
# Prerequisites:
#   1. Azure Developer CLI (azd):  https://learn.microsoft.com/azure/developer/azure-developer-cli/install-azd
#   2. Docker Desktop running
#   3. Azure CLI logged in:        az login
#   4. Azure subscription with OpenAI quota approved for GPT-4o + text-embedding-3-large
#
# Tear down all resources:        azd down
set -euo pipefail

RED='\033[0;31m'
GRN='\033[0;32m'
YLW='\033[0;33m'
BLD='\033[1m'
RST='\033[0m'

echo ""
echo -e "${BLD}=========================================="
echo -e "  BidCheck — Azure Deployment"
echo -e "==========================================${RST}"
echo ""

# ── Preflight checks ──────────────────────────────────────────────────────────

if ! command -v azd &>/dev/null; then
  echo -e "${RED}Error: Azure Developer CLI (azd) is not installed.${RST}"
  echo -e "  Install: https://learn.microsoft.com/azure/developer/azure-developer-cli/install-azd"
  echo -e "  macOS:   brew install azure/azd/azd"
  echo -e "  Windows: winget install microsoft.azd"
  exit 1
fi

if ! command -v docker &>/dev/null || ! docker info &>/dev/null 2>&1; then
  echo -e "${RED}Error: Docker is not installed or not running.${RST}"
  echo -e "  Start Docker Desktop and retry."
  exit 1
fi

if ! az account show &>/dev/null 2>&1; then
  echo -e "${YLW}Not logged in to Azure. Running az login...${RST}"
  az login
fi

echo -e "${GRN}✓${RST} Preflight checks passed"
echo ""

# ── Deploy ────────────────────────────────────────────────────────────────────
# azd up:
#   1. Provisions all Azure resources via infra/main.bicep
#   2. Builds the backend Docker image and pushes it to ACR
#   3. Deploys the container to Container Apps
#   4. Builds the frontend (npm run build) with VITE_API_URL injected
#   5. Deploys the frontend bundle to Static Web Apps

azd up

# ── Print summary ─────────────────────────────────────────────────────────────
echo ""
echo -e "${BLD}==========================================${RST}"
echo -e "${GRN}${BLD}  Deployment complete!${RST}"
echo ""

BACKEND_URI=$(azd env get-values 2>/dev/null | grep '^BACKEND_URI=' | cut -d= -f2- | tr -d '"' || echo "")
FRONTEND_URI=$(azd env get-values 2>/dev/null | grep '^FRONTEND_URI=' | cut -d= -f2- | tr -d '"' || echo "")

if [[ -n "$BACKEND_URI" ]]; then
  echo -e "  ${BLD}Backend API:${RST}  ${BACKEND_URI}"
  echo -e "  ${BLD}API docs:${RST}     ${BACKEND_URI}/docs"
  echo -e "  ${BLD}Health:${RST}       ${BACKEND_URI}/health"
fi
if [[ -n "$FRONTEND_URI" ]]; then
  echo -e "  ${BLD}Frontend:${RST}     ${FRONTEND_URI}"
fi

echo ""
echo -e "  To tear down all resources: ${YLW}azd down${RST}"
echo -e "${BLD}==========================================${RST}"
echo ""

targetScope = 'subscription'

@minLength(1)
@maxLength(64)
@description('Name of the environment (e.g. bidcheck-dev, bidcheck-prod)')
param environmentName string

@minLength(1)
@description('Azure region for all resources')
param location string

@description('Container image name — populated automatically by azd after image push')
param backendImageName string = ''

// ── Naming ────────────────────────────────────────────────────────────────────
var abbrs = loadJsonContent('./abbreviations.json')
var resourceToken = toLower(uniqueString(subscription().id, environmentName, location))
var tags = { 'azd-env-name': environmentName }

// ── Resource Group ────────────────────────────────────────────────────────────
resource rg 'Microsoft.Resources/resourceGroups@2022-09-01' = {
  name: '${abbrs.resourcesResourceGroups}${environmentName}'
  location: location
  tags: tags
}

// ── Azure Container Registry ──────────────────────────────────────────────────
module registry './core/security/registry.bicep' = {
  name: 'registry'
  scope: rg
  params: {
    name: '${abbrs.containerRegistryRegistries}${resourceToken}'
    location: location
    tags: tags
  }
}

// ── Azure OpenAI ──────────────────────────────────────────────────────────────
module openai './core/ai/cognitiveservices.bicep' = {
  name: 'openai'
  scope: rg
  params: {
    name: '${abbrs.cognitiveServicesAccounts}${resourceToken}'
    location: location
    tags: tags
    deployments: [
      {
        name: 'gpt-4o'
        model: { format: 'OpenAI', name: 'gpt-4o', version: '2024-11-20' }
        sku: { name: 'Standard', capacity: 10 }
      }
      {
        name: 'text-embedding-3-large'
        model: { format: 'OpenAI', name: 'text-embedding-3-large', version: '1' }
        sku: { name: 'Standard', capacity: 120 }
      }
    ]
  }
}

// ── Azure Files (persistent volume for SQLite + vector indexes) ───────────────
module storage './core/storage/storageaccount.bicep' = {
  name: 'storage'
  scope: rg
  params: {
    name: '${abbrs.storageStorageAccounts}${resourceToken}'
    location: location
    tags: tags
    fileShareName: 'bidcheckdata'
  }
}

// ── Container Apps (backend API) ──────────────────────────────────────────────
module backend './core/host/containerapp.bicep' = {
  name: 'backend'
  scope: rg
  params: {
    name: 'backend'
    location: location
    tags: union(tags, { 'azd-service-name': 'backend' })
    imageName: !empty(backendImageName) ? backendImageName : 'mcr.microsoft.com/azuredocs/containerapps-helloworld:latest'
    registryName: registry.outputs.name
    openAiEndpoint: openai.outputs.endpoint
    openAiApiKey: openai.outputs.apiKey
    storageAccountName: storage.outputs.name
    storageAccountKey: storage.outputs.key
    fileShareName: storage.outputs.fileShareName
    environmentName: environmentName
    resourceToken: resourceToken
  }
}

// ── Static Web App (frontend) ─────────────────────────────────────────────────
module frontend './core/host/staticwebapp.bicep' = {
  name: 'frontend'
  scope: rg
  params: {
    name: '${abbrs.webStaticSites}${resourceToken}'
    location: location
    tags: union(tags, { 'azd-service-name': 'frontend' })
  }
}

// ── Outputs ───────────────────────────────────────────────────────────────────
// azd reads these outputs and:
// - stores them in .azure/<env>/.env
// - exports VITE_API_URL into the environment before running "npm run build"
//   so Vite embeds the backend URL at build time (import.meta.env.VITE_API_URL)

output AZURE_LOCATION string = location
output AZURE_TENANT_ID string = tenant().tenantId
output AZURE_CONTAINER_REGISTRY_ENDPOINT string = registry.outputs.loginServer
output AZURE_CONTAINER_REGISTRY_NAME string = registry.outputs.name
output BACKEND_URI string = backend.outputs.uri
output VITE_API_URL string = backend.outputs.uri    // injected into Vite build
output SERVICE_BACKEND_IMAGE_NAME string = backend.outputs.imageName
output AZURE_STATIC_WEB_APPS_DEPLOYMENT_TOKEN string = frontend.outputs.deploymentToken
output FRONTEND_URI string = frontend.outputs.uri

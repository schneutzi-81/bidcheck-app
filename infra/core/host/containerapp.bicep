param name string
param location string
param tags object = {}
param imageName string
param registryName string
param openAiEndpoint string
@secure()
param openAiApiKey string
param storageAccountName string
@secure()
param storageAccountKey string
param fileShareName string
param environmentName string
param resourceToken string

var containerAppsEnvName = 'cae-${resourceToken}'
var volumeName = 'bidcheck-data'
var mountPath = '/app/data'

// ── Log Analytics workspace ──────────────────────────────────────────────────
resource logAnalytics 'Microsoft.OperationalInsights/workspaces@2022-10-01' = {
  name: 'law-${resourceToken}'
  location: location
  tags: tags
  properties: {
    retentionInDays: 30
    sku: { name: 'PerGB2018' }
  }
}

// ── Container Apps Environment ───────────────────────────────────────────────
resource containerAppsEnv 'Microsoft.App/managedEnvironments@2023-05-01' = {
  name: containerAppsEnvName
  location: location
  tags: tags
  properties: {
    appLogsConfiguration: {
      destination: 'log-analytics'
      logAnalyticsConfiguration: {
        customerId: logAnalytics.properties.customerId
        sharedKey: logAnalytics.listKeys().primarySharedKey
      }
    }
  }
}

// ── Azure Files volume binding on the environment ────────────────────────────
resource envStorage 'Microsoft.App/managedEnvironments/storages@2023-05-01' = {
  parent: containerAppsEnv
  name: 'bidcheckfiles'
  properties: {
    azureFile: {
      accountName: storageAccountName
      accountKey: storageAccountKey
      shareName: fileShareName
      accessMode: 'ReadWrite'
    }
  }
}

// ── Container App ────────────────────────────────────────────────────────────
resource containerApp 'Microsoft.App/containerApps@2023-05-01' = {
  name: name
  location: location
  tags: tags
  properties: {
    managedEnvironmentId: containerAppsEnv.id
    configuration: {
      ingress: {
        external: true
        targetPort: 8000
        transport: 'auto'
        corsPolicy: {
          allowedOrigins: ['*']   // tighten to frontend URL post-deployment
          allowedMethods: ['*']
          allowedHeaders: ['*']
        }
      }
      registries: [
        {
          server: '${registryName}.azurecr.io'
          username: registryName
          passwordSecretRef: 'registry-password'
        }
      ]
      secrets: [
        {
          name: 'registry-password'
          value: listCredentials(
            resourceId('Microsoft.ContainerRegistry/registries', registryName),
            '2023-07-01'
          ).passwords[0].value
        }
        {
          name: 'azure-openai-api-key'
          value: openAiApiKey
        }
        {
          name: 'storage-account-key'
          value: storageAccountKey
        }
      ]
    }
    template: {
      volumes: [
        {
          name: volumeName
          storageType: 'AzureFile'
          storageName: 'bidcheckfiles'
        }
      ]
      containers: [
        {
          name: 'backend'
          image: imageName
          resources: {
            cpu: json('1.0')
            memory: '2Gi'
          }
          // Env vars map directly to the pydantic-settings field names in config.py
          // (pydantic-settings reads AZURE_OPENAI_ENDPOINT -> azure_openai_endpoint, etc.)
          env: [
            { name: 'AZURE_OPENAI_ENDPOINT',              value: openAiEndpoint }
            { name: 'AZURE_OPENAI_API_KEY',               secretRef: 'azure-openai-api-key' }
            { name: 'AZURE_OPENAI_API_VERSION',           value: '2024-08-01-preview' }
            { name: 'AZURE_OPENAI_DEPLOYMENT_GPT4O',      value: 'gpt-4o' }
            { name: 'AZURE_OPENAI_DEPLOYMENT_EMBEDDING',  value: 'text-embedding-3-large' }
            // All persistent data lives on the Azure Files mount at /app/data
            { name: 'DATABASE_URL',   value: '${mountPath}/bidcheck.db' }
            { name: 'STORAGE_PATH',   value: '${mountPath}/storage' }
            { name: 'INDEXES_PATH',   value: '${mountPath}/indexes' }
          ]
          volumeMounts: [
            {
              volumeName: volumeName
              mountPath: mountPath
            }
          ]
          probes: [
            {
              type: 'Liveness'
              httpGet: { path: '/health', port: 8000 }
              initialDelaySeconds: 10
              periodSeconds: 30
            }
            {
              type: 'Readiness'
              httpGet: { path: '/health', port: 8000 }
              initialDelaySeconds: 5
              periodSeconds: 10
            }
          ]
        }
      ]
      scale: {
        minReplicas: 1    // keep 1 warm to avoid cold-start latency on first request
        maxReplicas: 3
        rules: [
          {
            name: 'http-scale'
            http: { metadata: { concurrentRequests: '10' } }
          }
        ]
      }
    }
  }
  dependsOn: [envStorage]
}

output uri string = 'https://${containerApp.properties.configuration.ingress.fqdn}'
output imageName string = imageName
output name string = containerApp.name

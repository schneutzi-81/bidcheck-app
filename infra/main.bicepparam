using './main.bicep'

param environmentName = readEnvironmentVariable('AZURE_ENV_NAME', 'bidcheck-dev')
param location       = readEnvironmentVariable('AZURE_LOCATION', 'swedencentral')
param backendImageName = readEnvironmentVariable('SERVICE_BACKEND_IMAGE_NAME', '')

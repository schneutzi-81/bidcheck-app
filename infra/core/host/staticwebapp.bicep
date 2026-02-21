param name string
param location string
param tags object = {}

// Static Web Apps are only available in specific regions — fall back to westeurope
var swaLocation = contains([
  'eastus2', 'centralus', 'westus2', 'westeurope', 'eastasia'
], location) ? location : 'westeurope'

resource swa 'Microsoft.Web/staticSites@2022-09-01' = {
  name: name
  location: swaLocation
  tags: tags
  sku: { name: 'Free', tier: 'Free' }
  properties: {
    stagingEnvironmentPolicy: 'Disabled'
    allowConfigFileUpdates: true
    buildProperties: {
      skipGithubActionWorkflowGeneration: true  // we deploy via azd, not GH Actions
    }
  }
}

output uri string = 'https://${swa.properties.defaultHostname}'
output name string = swa.name
output deploymentToken string = swa.listSecrets().properties.apiKey

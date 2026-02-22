param name string
param location string
param tags object = {}
param deployments array = []

resource account 'Microsoft.CognitiveServices/accounts@2023-05-01' = {
  name: name
  location: location
  tags: tags
  kind: 'OpenAI'
  sku: { name: 'S0' }
  properties: {
    customSubDomainName: name
    publicNetworkAccess: 'Enabled'
    disableLocalAuth: false
  }
}

// Azure enforces serial deployment creation — batchSize(1) is required
@batchSize(1)
resource deployment 'Microsoft.CognitiveServices/accounts/deployments@2023-05-01' = [for d in deployments: {
  parent: account
  name: d.name
  sku: d.sku
  properties: {
    model: d.model
    raiPolicyName: 'Microsoft.Default'
  }
}]

output endpoint string = account.properties.endpoint
output apiKey string = account.listKeys().key1
output name string = account.name

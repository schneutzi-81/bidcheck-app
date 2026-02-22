param name string
param location string
param tags object = {}
param fileShareName string = 'bidcheckdata'

resource storageAccount 'Microsoft.Storage/storageAccounts@2023-01-01' = {
  name: name
  location: location
  tags: tags
  kind: 'StorageV2'
  sku: { name: 'Standard_LRS' }
  properties: {
    accessTier: 'Hot'
    supportsHttpsTrafficOnly: true
    minimumTlsVersion: 'TLS1_2'
  }
}

resource fileService 'Microsoft.Storage/storageAccounts/fileServices@2023-01-01' = {
  parent: storageAccount
  name: 'default'
}

resource fileShare 'Microsoft.Storage/storageAccounts/fileServices/shares@2023-01-01' = {
  parent: fileService
  name: fileShareName
  properties: {
    shareQuota: 5   // 5 GiB — sufficient for prototype
    enabledProtocols: 'SMB'
  }
}

output name string = storageAccount.name
output key string = storageAccount.listKeys().keys[0].value
output fileShareName string = fileShare.name

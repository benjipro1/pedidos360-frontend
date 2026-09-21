export const environment = {
  production: true,
  clientId: 'b5c90e11-373c-4846-a4e0-5440187d52de',
  authority: 'https://login.microsoftonline.com/baffd3de-6d87-4351-b113-0276e469ae8d',
  // TODO: reemplazar por el dominio real de despliegue.
  redirectUri: 'https://TODO-dominio-produccion.example.com',
  // TODO: reemplazar por la URL real del API Gateway.
  apiBaseUrl: 'https://TODO-api-gateway.example.com',
  scopes: [
    'api://b5c90e11-373c-4846-a4e0-5440187d52de/pedidos.read',
    'api://b5c90e11-373c-4846-a4e0-5440187d52de/pedidos.write',
  ],
};

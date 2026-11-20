export const environment = {
  production: true,
  clientId: 'b5c90e11-373c-4846-a4e0-5440187d52de',
  authority: 'https://login.microsoftonline.com/baffd3de-6d87-4351-b113-0276e469ae8d',
  // Frontend servido por nginx (HTTPS) en la IP elastica de la EC2 backend.
  // Debe estar registrada como URI de redireccion SPA en Entra ID.
  redirectUri: 'https://32.196.34.1',
  // HTTP API de AWS API Gateway (pedidos360-api); las rutas cuelgan de /api.
  apiBaseUrl: 'https://s57a92dg4h.execute-api.us-east-1.amazonaws.com/api',
  scopes: [
    'api://b5c90e11-373c-4846-a4e0-5440187d52de/pedidos.read',
    'api://b5c90e11-373c-4846-a4e0-5440187d52de/pedidos.write',
  ],
};

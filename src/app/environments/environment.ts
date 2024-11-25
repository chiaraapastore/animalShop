export const environment = {
  production: false,
  baseUrl: 'http://localhost:8081',
  keycloak: {
    url: 'http://localhost:8080',
    realm: 'dog-shop-realm',
    clientId: 'dog-shop-app',
    adminClientId: 'admin-cli',
  }
};

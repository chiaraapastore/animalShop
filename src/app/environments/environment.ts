export const environment = {
  production: false,
  baseUrl: 'http://localhost:8081/api', // URL del backend Spring Boot
  keycloak: {
    url: 'http://localhost:8080',            // URL del server Keycloak
    realm: 'dog-shop-realm',                 // Nome del realm configurato
    clientId: 'dog-shop',                    // ID del client configurato in Keycloak per l'app Angular
    adminClientId: 'admin-cli',              // ID del client admin di Keycloak, se necessario
    adminAccessTokenUri: 'http://localhost:8080/realms/dog-shop-realm/protocol/openid-connect/token', // Endpoint per ottenere il token admin
  }
};

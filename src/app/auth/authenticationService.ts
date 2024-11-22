
import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  constructor(private keycloakService: KeycloakService) {}


  async getLoggedInUser(): Promise<{ email?: string; username?: string } | null> {
    try {
      const isAuthenticated = await this.keycloakService.isLoggedIn();
      if (isAuthenticated) {
        const keycloakInstance = this.keycloakService.getKeycloakInstance();
        if (keycloakInstance?.tokenParsed) {
          const tokenParsed: any = keycloakInstance.tokenParsed;
          const email = tokenParsed.email;
          const username = tokenParsed.preferred_username;
          return { email, username };
        }
      }
      return null;
    } catch (error) {
      console.error("Errore durante il recupero dell'utente loggato:", error);
      return null;
    }
  }


  logout() {
    const redirectUri = window.location.origin; // Torna alla homepage dopo il logout
    this.keycloakService.logout(redirectUri)
      .then(() => {
        console.log('Logout effettuato con successo');
      })
      .catch(error => {
        console.error('Errore durante il logout:', error);
      });
  }



}

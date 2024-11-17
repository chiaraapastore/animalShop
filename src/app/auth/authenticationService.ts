
import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  constructor(private keycloakService: KeycloakService) {}

  async getLoggedInUser(): Promise<{ email?: string, username?: string } | null> {
    try {
      const isAuthenticated = await this.keycloakService.isLoggedIn();
      if (isAuthenticated) {
        const keycloakInstance = this.keycloakService.getKeycloakInstance();
        if (keycloakInstance && keycloakInstance.tokenParsed) {
          const tokenParsed: any = keycloakInstance.tokenParsed;
          const email = tokenParsed.email;
          const username = tokenParsed.preferred_username;
          return { email, username };
        }
      }
      return null;
    } catch (error) {
      console.error('Errore durante il recupero dell\'utente loggato:', error);
      return null;
    }
  }
  logout() {
    this.keycloakService.logout('').then(() => {
      console.log("Logout effettuato");
    }).catch(error => {
      console.error("Errore durante il logout", error);
    });
  }


}

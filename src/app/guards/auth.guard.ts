// auth.guard.ts
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivate } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private keycloakService: KeycloakService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    if (!isPlatformBrowser(this.platformId)) {
      // Se non siamo nel browser, salta l'accesso
      return true;
    }

    try {
      const isAuthenticated = await this.keycloakService.isLoggedIn();
      if (!isAuthenticated) {
        await this.keycloakService.login();
        return false;
      }

      const keycloakInstance = this.keycloakService.getKeycloakInstance();
      if (keycloakInstance && keycloakInstance.tokenParsed) {
        const tokenParsed = keycloakInstance.tokenParsed;
        if (tokenParsed['resource_access']?.['dog-shop-app']) {
          const roles = tokenParsed['resource_access']['dog-shop-app'].roles;
          if (roles.includes('user')) {
            return true;
          } else {
            this.router.navigate(['/not-authorized']);
            return false;
          }
        } else {
          this.router.navigate(['/not-authorized']);
          return false;
        }
      } else {
        this.router.navigate(['/error']);
        return false;
      }
    } catch (error) {
      console.error('Errore durante l\'accesso:', error);
      this.router.navigate(['/error']);
      return false;
    }
  }
}

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
      return true;
    }

    try {
      const isAuthenticated = await this.keycloakService.isLoggedIn();
      if (!isAuthenticated) {
        await this.keycloakService.login({ redirectUri: state.url });
        return false;
      }

      const keycloakInstance = this.keycloakService.getKeycloakInstance();
      if (keycloakInstance?.tokenParsed) {
        const tokenParsed: any = keycloakInstance.tokenParsed;
        const roles = tokenParsed?.resource_access?.['dog-shop-app']?.roles || [];

        if (roles.includes('user')) {
          return true;
        } else {
          this.router.navigate(['/not-authorized']);
          return false;
        }
      } else {
        this.router.navigate(['/error']);
        return false;
      }
    } catch (error) {
      console.error("Errore durante l'accesso:", error);
      this.router.navigate(['/error']);
      return false;
    }
  }
}

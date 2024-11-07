import { Injectable } from '@angular/core';
import { KeycloakAuthGuard, KeycloakService } from 'keycloak-angular';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard extends KeycloakAuthGuard {
  constructor(protected override router: Router, protected keycloakService: KeycloakService) {
    super(router, keycloakService);
  }

  override isAccessAllowed(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      if (!this.authenticated) {
        await this.keycloakService.login();
        return;
      }
      resolve(this.authenticated);
    });
  }
}

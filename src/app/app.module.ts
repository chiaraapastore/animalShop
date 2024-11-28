import {NgModule, APP_INITIALIZER, PLATFORM_ID, inject} from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AnnouncementsComponent } from './announcements/announcements.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { HomeComponent } from './home/home.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { ContactComponent } from './contact/contact.component';
import { ProductListComponent } from './product-list/product-list.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { PaymentComponent } from './payment/payment.component';
import { ConfirmPageComponent } from './confirm-page/confirm-page.component';
import { ProfileComponent } from './profile/profile.component';
import { OrdersComponent } from './orders/orders.component';
import {CartComponent} from "./cart/cart.component";
import { ErrorComponent } from './error/error.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { AdminComponent } from './admin/admin.component';
import { CreaProdottoComponent } from './crea-prodotto/crea-prodotto.component';



export function initializeKeycloak(keycloak: KeycloakService, platformId: Object) {
  return () =>
    isPlatformBrowser(platformId)
      ? keycloak
        .init({
          config: {
            url: 'http://localhost:8080',
            realm: 'dog-shop-realm',
            clientId: 'dog-shop-app',
          },
          initOptions: {
            onLoad: 'check-sso',
            checkLoginIframe: false,
          },
        })
        .then(() => {
          console.log('Keycloak inizializzato con successo');
          console.log('Ruoli utente:', keycloak.getUserRoles());
        })
        .catch((err) => {
          console.error('Errore inizializzazione Keycloak:', err);
        })
      : Promise.resolve();
}

@NgModule({
  declarations: [
    AppComponent,
    AnnouncementsComponent,
    HomeComponent,
    AboutUsComponent,
    ContactComponent,
    CreaProdottoComponent,
    ProductListComponent,
    CartComponent,
    PaymentComponent,
    ConfirmPageComponent,
    ProfileComponent,
    OrdersComponent,
    ErrorComponent,
    AdminComponent,
    CreaProdottoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    KeycloakAngularModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      toastClass: 'ngx-toastr',
      positionClass: 'toast-top-right',
      timeOut: 5000,
      closeButton: true,
      progressBar: true,
    }),
  ],
  providers: [
    provideClientHydration(),
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService, PLATFORM_ID]
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

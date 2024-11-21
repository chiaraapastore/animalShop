import { NgModule, APP_INITIALIZER, PLATFORM_ID } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NavigationComponent } from './navigation/navigation.component';
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

export function initializeKeycloak(keycloak: KeycloakService, platformId: Object) {
  return () =>
    isPlatformBrowser(platformId)
      ? keycloak.init({
        config: {
          url: 'http://localhost:8080',
          realm: 'dog-shop-realm',
          clientId: 'dog-shop-app'
        },
        initOptions: {
          onLoad: 'login-required',
          checkLoginIframe: false
        },
        enableBearerInterceptor: true,
        bearerPrefix: 'Bearer',
      })
      : Promise.resolve();
}


@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    AnnouncementsComponent,
    HomeComponent,
    AboutUsComponent,
    ContactComponent,
    ProductListComponent,
    CartComponent,
    PaymentComponent,
    ConfirmPageComponent,
    ProfileComponent,
    OrdersComponent,
    ErrorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    KeycloakAngularModule,
    ReactiveFormsModule,
    BrowserAnimationsModule, // Necessario per ngx-toastr
    ToastrModule.forRoot({
      toastClass: 'ngx-toastr', // Usa la classe personalizzata
      positionClass: 'toast-top-right', // Posizione
      timeOut: 5000, // Durata in millisecondi
      closeButton: true, // Mostra il pulsante di chiusura
      progressBar: true, // Mostra la barra di progresso
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

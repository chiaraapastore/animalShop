import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { environment } from './environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NavigationComponent } from './navigation/navigation.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { AnnouncementsComponent } from './announcements/announcements.component';
import { FormsModule } from "@angular/forms";
import { HomeComponent } from './home/home.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { ContactComponent } from './contact/contact.component';
import { ProductListComponent } from './product-list/product-list.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

function initializeKeycloak(keycloak: KeycloakService) {
  return () =>
    keycloak.init({
      config: {
        url: environment.keycloak.url,
        realm: environment.keycloak.realm,
        clientId: environment.keycloak.clientId
      },
      initOptions: {
        onLoad: 'login-required',   // Avvia la sessione all'avvio
        checkLoginIframe: false
      }
    });
}

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    FeedbackComponent,
    AnnouncementsComponent,
    HomeComponent,
    AboutUsComponent,
    ContactComponent,
    ProductListComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    KeycloakAngularModule,
  ],
  providers: [
    provideClientHydration(),
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService]
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

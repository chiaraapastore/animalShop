import {Component, OnInit, Renderer2} from '@angular/core';
import { Router, NavigationEnd, Event } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthenticationService } from "./auth/authenticationService";
import { ProductService } from "./services/product.service";
import { KeycloakService } from 'keycloak-angular';
import {Product} from "./models/product.model";
import {UtenteShopService} from "./services/utenteShop.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'AnimalShop'; // Titolo dell'app
  isProductPage = false; // Indica se l'utente si trova nella pagina dei prodotti
  searchKeyword: string = ''; // Parola chiave per la ricerca dei prodotti
  searchResults: Product[] = []; // Risultati della ricerca
  userDetails: any; // Dettagli utente autenticato


  constructor(
    private router: Router,
    private renderer: Renderer2,
    private auth: AuthenticationService,
    private productService: ProductService,
    private keycloakService: KeycloakService, // Import del servizio Keycloak
    private utenteService: UtenteShopService
  ) {
    // Monitoraggio delle navigazioni per aggiungere/rimuovere classi specifiche al body
    this.router.events
      .pipe(filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        if (typeof document !== 'undefined') {
          this.updateBodyClasses(event.url);
          this.isProductPage = this.checkIfProductPage(event.url);
        }
      });
  }

  ngOnInit(): void {
    if (this.keycloakService.isLoggedIn()) {
      this.getUserDetails();
    }
  }

  async goToUserProfile(): Promise<void> {
    try {
      const isAuthenticated = await this.keycloakService.isLoggedIn();
      if (isAuthenticated) {
        // Naviga alla pagina del profilo utente
        await this.router.navigate(['/user-profile']);
      } else {
        // Effettua il login se l'utente non è autenticato
        await this.keycloakService.login();
      }
    } catch (error) {
      console.error('Errore durante il controllo dell\'autenticazione:', error);
    }
  }


  private getUserDetails(): void {
    const keycloak = this.keycloakService.getKeycloakInstance();
    this.userDetails = {
      email: keycloak.tokenParsed?.email,
      username: keycloak.tokenParsed?.preferred_username,
      firstName: keycloak.tokenParsed?.given_name,
      lastName: keycloak.tokenParsed?.family_name,
      keycloakId: keycloak.tokenParsed?.sub,
    };

    console.log('Dati utente recuperati da Keycloak:');
    console.log('Email:', this.userDetails.email);
    console.log('Username:', this.userDetails.username);
    console.log('Nome:', this.userDetails.firstName);
    console.log('Cognome:', this.userDetails.lastName);
    console.log('Keycloak ID:', this.userDetails.keycloakId);

    // Controlla se l'utente esiste nel backend prima di salvarlo
    this.utenteService.checkUserExists(this.userDetails.username).subscribe({
      next: (exists) => {
        if (!exists) {
          this.saveUserToBackend(this.userDetails);
        } else {
          console.log('Utente già esistente nel backend.');
        }
      },
      error: (error) => {
        console.error('Errore durante il controllo dell\'utente:', error);
      }
    });
  }




  private saveUserToBackend(userDetails: any): void {
    this.utenteService.createUser(userDetails).subscribe({
      next: (response) => {
        console.log('Utente creato con successo:', response);
      },
      error: (error) => {
        if (error.status === 409) {
          console.log('Utente già esistente nel backend.');
        } else {
          console.error('Errore nella creazione dell\'utente:', error);
        }
      }
    });
  }

  private updateBodyClasses(url: string): void {
    // Rimuove classi esistenti
    const bodyClasses = ['about-us-page', 'contact-page', 'announcements-page'];
    bodyClasses.forEach(cls => this.renderer.removeClass(document.body, cls));

    // Aggiunge la classe corretta in base all'URL
    const cleanUrl = url.split('?')[0]; // Rimuove parametri della query string
    switch (cleanUrl) {
      case '/about-us':
        this.renderer.addClass(document.body, 'about-us-page');
        break;
      case '/contact':
        this.renderer.addClass(document.body, 'contact-page');
        break;
      case '/announcements':
        this.renderer.addClass(document.body, 'announcements-page');
        break;
      default:
        break;
    }
  }


  private checkIfProductPage(url: string): boolean {
    const cleanUrl = url.split('?')[0];
    return cleanUrl.startsWith('/shop');
  }


  searchProducts(event: SubmitEvent): void {
    event.preventDefault();
    console.log('Keyword:', this.searchKeyword);

    const trimmedKeyword = this.searchKeyword.trim();
    if (trimmedKeyword) {
      // Naviga alla pagina dei prodotti con i parametri di ricerca
      this.router.navigate(['/shop'], { queryParams: { keyword: trimmedKeyword } }).then(() => {
        // Rimuove i parametri dalla barra degli indirizzi dopo la navigazione
        window.history.replaceState({}, '', '/shop');
      });
    } else {
      // Naviga alla pagina dei prodotti senza parametri
      this.router.navigate(['/shop']);
    }
  }

  logout(): void {
    try {
      this.auth.logout();
      console.log('Utente disconnesso');
    } catch (error) {
      console.error('Errore durante il logout:', error);
    }
  }
}

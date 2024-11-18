import { Component, Renderer2 } from '@angular/core';
import { Router, NavigationEnd, Event, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthenticationService } from "./auth/authenticationService";
import { Product } from "./models/product.model";
import { ProductService } from "./services/product.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'AnimalShop';
  isProductPage = false;
  searchKeyword: string = '';

  constructor(
    private router: Router,
    private renderer: Renderer2,
    private route: ActivatedRoute,
    private auth: AuthenticationService,
    private productService: ProductService
  ) {
    this.router.events
      .pipe(filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        if (typeof document !== 'undefined') {
          // Rimuovi classi specifiche dal body
          this.renderer.removeClass(document.body, 'about-us-page');
          this.renderer.removeClass(document.body, 'contact-page');
          this.renderer.removeClass(document.body, 'feedback-page');
          this.renderer.removeClass(document.body, 'announcements-page');

          // Aggiungi classe specifica per la pagina attuale
          const cleanUrl = event.url.split('?')[0]; // Rimuove i parametri della query string
          switch (cleanUrl) {
            case '/about-us':
              this.renderer.addClass(document.body, 'about-us-page');
              break;
            case '/contact':
              this.renderer.addClass(document.body, 'contact-page');
              break;
            case '/feedback':
              this.renderer.addClass(document.body, 'feedback-page');
              break;
            case '/announcements':
              this.renderer.addClass(document.body, 'announcements-page');
              break;
          }

          this.isProductPage = cleanUrl.startsWith('/shop');
          console.log("isProductPage:", this.isProductPage);
        }
      });
  }

  searchProducts(event: SubmitEvent): void {
    event.preventDefault();
    console.log('Keyword:', this.searchKeyword);
    if (this.searchKeyword.trim()) {
      this.router.navigate(['/shop'], { queryParams: { keyword: this.searchKeyword.trim() } }).then(() => {
        // Rimuovi i parametri dopo la navigazione
        window.history.replaceState({}, '', '/shop');
      });
    } else {
      this.router.navigate(['/shop']);
    }
  }

  logout() {
    this.auth.logout();
  }
}

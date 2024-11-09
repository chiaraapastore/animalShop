import { Component, Renderer2 } from '@angular/core';
import { Router, NavigationEnd, Event, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'AnimalShop';
  isProductPage = false;

  constructor(private router: Router, private renderer: Renderer2, private route: ActivatedRoute) {
    this.router.events
      .pipe(filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        if (typeof document !== 'undefined') {
          // Rimuovi le classi di pagina specifiche
          this.renderer.removeClass(document.body, 'about-us-page');
          this.renderer.removeClass(document.body, 'contact-page');
          this.renderer.removeClass(document.body, 'feedback-page');
          this.renderer.removeClass(document.body, 'announcements-page');

          // Aggiungi la classe specifica per ogni pagina
          switch (event.url) {
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

          this.isProductPage = event.url.startsWith('/shop');
          console.log("isProductPage:", this.isProductPage); // Debug per vedere se funziona
        }
      });
  }
}

import { Component, Renderer2 } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'animalShop';
  constructor(private router: Router, private renderer: Renderer2) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Rimuovi tutte le classi personalizzate dal body
        this.renderer.removeClass(document.body, 'about-us-page');
        this.renderer.removeClass(document.body, 'contact-page');
        this.renderer.removeClass(document.body, 'feedback-page');
        this.renderer.removeClass(document.body, 'announcements-page'); // Rimuove anche la classe announcements-page

        // Aggiungi la classe appropriata in base al percorso
        if (event.url === '/about-us') {
          this.renderer.addClass(document.body, 'about-us-page');
        } else if (event.url === '/contact') {
          this.renderer.addClass(document.body, 'contact-page');
        } else if (event.url === '/feedback') {
          this.renderer.addClass(document.body, 'feedback-page');
        } else if (event.url === '/announcements') { // Gestione della pagina Announcements
          this.renderer.addClass(document.body, 'announcements-page');
        }
      }
    });
  }
}

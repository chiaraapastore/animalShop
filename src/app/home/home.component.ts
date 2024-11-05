import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  testimonials = [
    { text: 'Ottimo servizio e prodotti di qualità! Il mio cane adora il suo nuovo gioco.', author: 'Sara B.' },
    { text: 'Ho trovato tutto ciò che cercavo per il mio cucciolo. Consegna rapida e prezzi convenienti!', author: 'Marco L.' },
    { text: 'Prodotti eccellenti e un team molto disponibile. Super consigliato!', author: 'Anna R.' },
    { text: 'Spedizione veloce e ottimo rapporto qualità-prezzo. Consigliato!', author: 'Laura P.' },
    { text: 'Servizio clienti cordiale e prodotti eccellenti. Il mio cane è felice!', author: 'Davide M.' },
    { text: 'Prodotti di alta qualità e buon servizio clienti!', author: 'Luca N.' }
  ];

  scrollIndex = 0;
  testimonialsPerPage = 3;

  get visibleTestimonials() {
    return this.testimonials.slice(this.scrollIndex, this.scrollIndex + this.testimonialsPerPage);
  }

  scrollCarousel(direction: number) {
    const maxScrollIndex = Math.max(0, this.testimonials.length - this.testimonialsPerPage);

    this.scrollIndex += direction * this.testimonialsPerPage;

    if (this.scrollIndex < 0) {
      this.scrollIndex = maxScrollIndex;
    } else if (this.scrollIndex > maxScrollIndex) {
      this.scrollIndex = 0;
    }
  }
}

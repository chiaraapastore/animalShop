import { Component } from '@angular/core';

@Component({
  selector: 'app-announcements',
  templateUrl: './annunci.component.html',
  styleUrls: ['./annunci.component.css']
})
export class AnnunciComponent {
  announcements = [
    {
      title: 'Sconto del 20% su tutti gli alimenti per cani',
      description: 'Approfitta del nostro sconto speciale sugli alimenti per cani di tutte le marche! L\'offerta è valida fino alla fine del mese.'
    },
    {
      title: 'Nuova collezione di giocattoli',
      description: 'Scopri i nostri nuovi giocattoli per cani, pensati per il divertimento e il benessere. Acquista ora e ottieni il 10% di sconto!'
    },
    {
      title: 'Consegna gratuita per ordini sopra i 50€',
      description: 'Ottieni la consegna gratuita su tutti gli ordini superiori a 50€. Non perdere questa occasione!'
    },
    {
      title: 'Promozione di primavera',
      description: 'Preparati alla primavera con la nostra collezione di accessori! Sconto del 15% su tutti i collari e guinzagli.'
    },
    {
      title: 'Weekend speciale: 2x1 su tutti i giochi',
      description: 'Solo per questo fine settimana, compra un giocattolo e ne ricevi un altro gratis!'
    }
  ];
}

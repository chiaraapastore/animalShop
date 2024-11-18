import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Order } from '../models/order.model';
import { OrdersService } from '../services/order.service'; // Importiamo il modello dell'ordine

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit, OnDestroy {
  orders: Order[] = [];
  errorMessage: string = '';

  constructor(
    private ordersService: OrdersService,
    @Inject(PLATFORM_ID) private platformId: Object // Aggiunto per identificare il contesto
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      document.body.classList.add('orders-page'); // Aggiunge la classe al body solo nel browser
    }
    this.loadOrders();
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      document.body.classList.remove('orders-page'); // Rimuove la classe solo nel browser
    }
  }

  loadOrders(): void {
    this.ordersService.getMyOrders().subscribe(
      (orders) => {
        this.orders = orders;
        if (this.orders.length === 0) {
          this.errorMessage = 'Non hai ancora effettuato alcun ordine.';
        } else {
          this.errorMessage = '';
        }
      },
      (error) => {
        console.error('Errore nel caricamento degli ordini', error);
        this.errorMessage = 'Si è verificato un errore nel recupero degli ordini. Riprova più tardi.';
      }
    );
  }
}

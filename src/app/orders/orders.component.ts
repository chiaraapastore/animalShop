import { Component, OnInit } from '@angular/core';
import { Order } from '../models/order.model';
import {OrdersService} from "../services/order.service"; // Importiamo il modello dell'ordine

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  errorMessage: string = '';

  constructor(private ordersService: OrdersService) { }

  ngOnInit(): void {
    this.loadOrders();
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

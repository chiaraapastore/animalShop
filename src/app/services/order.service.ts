import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Order } from "../models/order.model";

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private apiUrl = 'http://localhost:8081/api/orders';

  constructor(private http: HttpClient) {}

  // Metodo esistente per ottenere gli ordini dell'utente
  getMyOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/myOrders`);
  }

  // Metodo per annullare un ordine
  cancelOrder(orderId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${orderId}`);
  }
}

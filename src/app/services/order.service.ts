import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Inject, Injectable, PLATFORM_ID} from "@angular/core";
import { Observable } from "rxjs";
import {isPlatformBrowser} from "@angular/common";
import {Order} from "../models/order.model";

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private apiUrl = 'http://localhost:8081/api/orders';

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object ) {}

  getMyOrders(): Observable<Order[]> {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.get<Order[]>(`${this.apiUrl}/myOrders`, { headers });
    } else {
      return new Observable<Order[]>();
    }
  }


  cancelOrder(orderId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${orderId}`);
  }


}

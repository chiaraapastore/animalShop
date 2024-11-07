import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'https://localhost:8081/api/cart';  // Cambia con l'URL del tuo backend

  constructor(private http: HttpClient) {}

  // Aggiungi un prodotto al carrello, accettando un ID prodotto come stringa
  addProductToCart(productId: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/add`, { productId });
  }

  // Ottieni gli elementi del carrello
  getCartItems(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/items`);
  }

  // Incrementa il contatore del carrello (opzionale se vuoi un contatore lato client)
  getCartCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/count`);
  }
}

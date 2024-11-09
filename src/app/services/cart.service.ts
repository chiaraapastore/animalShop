import {Observable} from "rxjs";
import {Cart} from "../models/cart.model";
import {Order} from "../models/order.model";
import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'http://localhost:8081/api/cart';

  constructor(private http: HttpClient) {}

  // Aggiungi un prodotto al carrello
  addProductToCart(cartId: number, productId: string, quantity: number = 1): Observable<Cart> {
    return this.http.post<Cart>(`${this.apiUrl}/add`, { cartId, productId, quantity });
  }

  // Crea un nuovo carrello per l'utente
  createCart(userId: string): Observable<Cart> {
    return this.http.post<Cart>(`${this.apiUrl}/create`, { userId });
  }

  checkout(cartId: number): Observable<Order> {
    return this.http.post<Order>(`${this.apiUrl}/checkout/${cartId}`, {});
  }

  getCart(): Observable<Cart> {
    return this.http.get<Cart>(`${this.apiUrl}/user`);
  }

  getCartByUserId(userId: string): Observable<Cart> {
    return this.http.get<Cart>(`${this.apiUrl}/user/${userId}`);
  }

}

import {Observable} from "rxjs";
import {Cart} from "../models/cart.model";
import {Order} from "../models/order.model";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Product} from "../models/product.model";
import {Payment} from "../models/payment.model";

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'http://localhost:8081/api/cart';

  constructor(private http: HttpClient) {}

  addProductToCart(productId: string, quantity: number = 1, userName: string): Observable<Cart> {
    const payload = { productId, quantity, userName };
    console.log("Payload inviato:", payload);
    return this.http.post<Cart>(`${this.apiUrl}/addProductToCart`, payload);
  }


  checkout(cartId: number): Observable<Order> {
    return this.http.post<Order>(`${this.apiUrl}/checkout/${cartId}`, {});
  }

  getCartProducts(username: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/cart-with-products`, { params: { username } });
  }

  removeProductFromCart(productId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/remove/${productId}`);
  }

  updateProductQuantity(productId: number, quantity: number, username: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/update-quantity/${productId}`, null, {
      params: { quantity: quantity.toString(), username}});
  }


}

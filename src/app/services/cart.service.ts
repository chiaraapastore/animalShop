import {map, Observable} from "rxjs";
import {Cart} from "../models/cart.model";
import {Order} from "../models/order.model";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {CartProduct} from "../models/cartProduct.model";


@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'http://localhost:8081/api/cart';

  constructor(private http: HttpClient) {}

  addProductToCart(productId: string, quantity: number = 1, username: string): Observable<Cart> {
    if (quantity <= 0) {
      throw new Error('Quantità non valida. Non è possibile aggiungere un prodotto con quantità 0 al carrello.');
    }

    const payload = { productId, quantity, username };
    console.log("Payload inviato:", payload);
    return this.http.post<Cart>(`${this.apiUrl}/addProductToCart`, payload);
  }


  checkout(cartId: number): Observable<Order> {
    return this.http.post<Order>(`${this.apiUrl}/checkout/${cartId}`, {});
  }

  getCartProducts(username: string): Observable<CartProduct[]> {
    return this.http.get<CartProduct[]>(`${this.apiUrl}/cart-with-products`, { params: { username } });
  }


  removeProductFromCart(productId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/remove/${productId}`);
  }

  updateProductQuantity(productId: number, quantity: number, username: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/update-quantity/${productId}`, null, {
      params: { quantity: quantity.toString(), username}});
  }


}

import {CartItem} from "./cartItem.model";

export interface Cart {
  id: number;
  utenteShop: any;
  cartItems: CartItem[];
}

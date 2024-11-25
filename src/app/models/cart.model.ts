import {CartProduct} from "./cartProduct.model";

export interface Cart {
  id: number;
  utenteShop: any;
  cartProduct: CartProduct[];
}

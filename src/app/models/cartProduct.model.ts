import {Product} from "./product.model";

export interface CartProduct {
  cartId: number;
  product: Product;
  quantity: number;
}

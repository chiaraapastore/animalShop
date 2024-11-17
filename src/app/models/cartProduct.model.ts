import {Product} from "./product.model";

export interface CartProduct {
  id: number;
  product: Product;
  quantity: number;
}

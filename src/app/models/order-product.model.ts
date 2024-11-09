import { Product } from './product.model';

export interface OrderProduct {
  id: number;
  product: Product;
  quantity: number;
}

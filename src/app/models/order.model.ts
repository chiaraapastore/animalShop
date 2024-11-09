
import { Payment } from './payment.model';
import {OrderProduct} from "./order-product.model";

export interface Order {
  id: number;
  userId: number; // ID utente associato all'ordine
  orderProducts: OrderProduct[]; // Lista dei prodotti ordinati
  payment: Payment;
  orderDate: Date;
  status: string;
  totalAmount: number;
}

import {OrderProduct} from "./order-product.model";

export interface CustomerOrder {
  id: number;
  utenteShopId: number;
  orderDate: string;
  status: string;
  totalAmount: number;
  paymentId?: number;
  orderNumber: string;
  orderProducts: OrderProduct[];
}


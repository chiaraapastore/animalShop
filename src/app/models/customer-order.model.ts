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

export interface OrderProduct {
  id: number;
  productId: number;
  quantity: number;
}

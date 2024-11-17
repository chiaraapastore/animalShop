export interface Payment {
  id?: number;
  customerOrder: any;
  paymentDate: string;
  paymentMethod: string;
  status: string;
}

import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Payment} from "../models/payment.model";
import {catchError, Observable, throwError} from "rxjs";
import {CustomerOrder} from "../models/customer-order.model";

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = 'http://localhost:8081/api/payment';

  constructor(private http: HttpClient) {}

  /*createPayment(payment: Payment): Observable<Payment> {
    return this.http.post<Payment>(`${this.apiUrl}/createPayment`, payment);
  }*/


  checkout(): Observable<CustomerOrder> {
    return this.http.post<CustomerOrder>(`${this.apiUrl}/checkout`, {});
  }

  acquista(payment: Payment): Observable<Payment> {
    return this.http.post<Payment>(`${this.apiUrl}/acquista`, payment);
  }


}

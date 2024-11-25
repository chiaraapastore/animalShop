import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Payment} from "../models/payment.model";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = 'http://localhost:8081/api/payment';

  constructor(private http: HttpClient) {}

  createPayment(payment: Payment): Observable<Payment> {
    return this.http.post<Payment>(`${this.apiUrl}/createPayment`, payment);
  }

}

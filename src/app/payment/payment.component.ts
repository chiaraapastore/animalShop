import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  cartItems: any[] = [];
  totalAmount: number = 0;

  cardNumber: string = '';
  cardHolderName: string = '';
  cardHolderSurname: string = '';
  expiryDate: string = '';
  cvv: string = '';
  billingAddress: string = '';

  constructor(private router:Router) { }

  ngOnInit(): void {

  }

  processPayment(): void {
    console.log('Pagamento effettuato con successo!');
    console.log(`Card Number: ${this.cardNumber}`);
    console.log(`Expiry Date: ${this.expiryDate}`);
    console.log(`CVV: ${this.cvv}`);
    console.log(`Billing Address: ${this.billingAddress}`);
  }

  goToConfirmPage(){
    this.router.navigate(["/confirm-page"])
  }
}

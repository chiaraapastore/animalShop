import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { Payment } from "../models/payment.model";
import { PaymentService } from "../services/payment.service";
import { CartService } from "../services/cart.service";
import {AuthenticationService} from "../auth/authenticationService";
import {ToastrService} from "ngx-toastr";


@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {

  cardNumber: string = '';
  cardHolderName: string = '';
  cardHolderSurname: string = '';
  expiryDate: string = '';
  cvv: string = '';
  billingAddress: string = '';
  cartItems: any[] = [];
  totalAmount: number = 0;
  orderId: number = 0;

  constructor(
    private router: Router,
    private paymentService: PaymentService,
    private cartService: CartService,
    private auth: AuthenticationService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.loadCartProducts();
  }




  async loadCartProducts(): Promise<void> {
    const user = await this.auth.getLoggedInUser();
    if (user) {
      const username = user.username || 'Email non disponibile';
      this.cartService.getCartProducts(username).subscribe(
        (products) => {
          console.log("Carrello con prodotti", products);
          this.cartItems = products.map(product => ({
            product,
            quantity: product.quantity
          }));
          this.calculateTotalAmount();
        },
        (error) => {
          console.error("Errore nel caricare i prodotti del carrello:", error);
        }
      );
    }
  }

  calculateTotalAmount(): void {
    this.totalAmount = this.cartItems.reduce((total, item) => total + (item.product.product.price * item.quantity), 0);
  }

  async processPayment(): Promise<void> {
    const user = await this.auth.getLoggedInUser();
    if (!user || !user.username) {
      console.error("Errore: Utente non autenticato.");
      return;
    }

    this.paymentService.checkout().subscribe({
      next: (ordine) => {
        console.log("Checkout completato con successo!", ordine);
        this.orderId = ordine.id;
        this.completePayment();
      },
      error: (err) => {
        console.error("Errore durante il checkout:", err);
      },
    });
  }

  completePayment(): void {
    if (!this.orderId) {
      console.error("Errore: ID dell'ordine non presente.");
      return;
    }

    const payment: Payment = {
      id: this.orderId,
      paymentDate: new Date().toISOString(),
      paymentMethod: "Credit Card",
      status: "PENDING",
    };

    console.log("Payload inviato per il pagamento:", payment);

    this.paymentService.acquista(payment).subscribe({
      next: (savedPayment) => {
        console.log("Pagamento completato con successo!", savedPayment);
        this.goToConfirmPage();
      },
      error: (err) => {
        console.error("Errore durante il pagamento:", err);
      },
    });
  }
  annullaOrdine(): void {
    this.paymentService.checkout().subscribe({
      next: (ordine) => {
        if (!ordine || !ordine.id) {
          this.toastr.error('Errore durante il checkout. Ordine non valido.');
          console.error('Errore: ID ordine non restituito dal backend.');
          return;
        }

        const orderId = ordine.id;
        console.log('ID ordine generato dal checkout per annullamento:', orderId);

        this.toastr.info('Sto annullando l\'ordine...', 'Conferma');


        this.paymentService.annullaOrdine(orderId).subscribe({
          next: () => {
            this.toastr.success('Ordine annullato con successo.', 'Successo');

            this.router.navigate(['/shop']);
          },
          error: (error) => {
            console.error('Errore durante l\'annullamento dell\'ordine:', error);
          },
        });
      },
      error: (err) => {
        console.error('Errore durante il checkout:', err);
        this.toastr.error('Errore durante il checkout.', 'Errore');
      },
    });
  }


  goToConfirmPage() {
    this.router.navigate(["/confirm-page"]);
  }
}

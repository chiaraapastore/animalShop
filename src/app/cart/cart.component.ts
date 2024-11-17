import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { CartService } from "../services/cart.service";
import { AuthenticationService } from "../auth/authenticationService";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];

  get totalAmount(): number {
    return this.cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  }

  constructor(
    private router: Router,
    private cartService: CartService,
    private auth: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.loadCartProducts();
  }

  async loadCartProducts(): Promise<void> {
    const user = await this.auth.getLoggedInUser();
    if (user) {
      const username = user.username || 'Email non disponibile';
      this.cartService.getCartProducts(username).subscribe({
        next: (products) => {
          console.log("Prodotti nel carrello:", products);
          this.cartItems = products.map(product => ({
            product,
            quantity: 1 // Inizializza la quantità
          }));
        },
        error: (error) => {
          console.error("Errore durante il caricamento dei prodotti nel carrello:", error);
        }
      });
    } else {
      console.warn("Utente non autenticato.");
    }
  }

  async removeFromCart(item: any): Promise<void> {
    const user = await this.auth.getLoggedInUser();
    if (user) {
      const productId = item.product.id;

      // Aggiorna immediatamente la lista dei prodotti nel carrello
      this.cartItems = this.cartItems.filter(cartItem => cartItem.product.id !== productId);

      // Effettua la chiamata API per la rimozione del prodotto
      this.cartService.removeProductFromCart(productId).subscribe({
        next: () => {
          console.log('Prodotto rimosso dal carrello con successo');
        },
        error: (error) => {
          console.error('Errore durante la rimozione del prodotto:', error);
          // Ricarica i prodotti nel carrello in caso di errore
          this.loadCartProducts();
        }
      });
    } else {
      console.warn("Utente non autenticato.");
    }
  }


  updateQuantity(item: any): void {
    const productId = item.product.id;
    const quantity = item.quantity;

    if (quantity > 0) {
      this.cartService.updateProductQuantity(productId, quantity).subscribe({
        next: () => {
          console.log('Quantità aggiornata con successo');
        },
        error: (error) => {
          console.error('Errore durante l\'aggiornamento della quantità', error);
        }
      });
    } else {
      console.warn("Quantità non valida");
    }
  }

  checkout(): void {
    this.router.navigate(["/payment"]);
  }
}

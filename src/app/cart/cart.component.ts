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
          this.cartItems = products.map(product => ({
            product: {
              ...product,
              imageUrl: this.getImageUrlForProduct(product.productName) // Assegna l'immagine corretta
            },
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

  getImageUrlForProduct(productName: string): string {
    const images: { [key: string]: string } = {
      'Cibo Naturale per Cani Adulto': '/assets/images/cibo-naturale.jpg',
      'Ciotola Antiscivolo per Cani': '/assets/images/ciotola-antiscivolo.jpg',
      'Collare Anti Pulci': '/assets/images/collare-anti-pulci.jpg',
      'Scatolette per Cani Adulti': '/assets/images/scatolette.jpg',
      'Snack per Cani con Carni Selezionate': '/assets/images/snack.jpg',
      'Snack Dentastik': '/assets/images/snack-dentastik.jpg',
      'Scatolette per Cani di Taglia piccola': '/assets/images/scatolette-cani-taglia-piccola.jpg',
      'Palla Disco Doggy': '/assets/images/palla-freesbe.jpg',
      'Raccogli Bisogni': '/assets/images/raccogli-bisogni.jpg',
      'Gioco Interattivo con Corda': '/assets/images/corda.jpg',
      'Gioco Interattivo con Cibo': '/assets/images/gioco-cibo.jpg',
      'Peluche Morbido per Cani': '/assets/images/peluche.jpg',
      'Crocchette per Cani Senior': '/assets/images/crocchette-cani-senior.jpg',
      'Crocchette per Cani Junior': '/assets/images/crocchette-cani-junior.jpg',
      'Gioco a Forma di Osso per Cani': '/assets/images/osso.jpg',
      'Snack Naturali per Cani': '/assets/images/snack-naturali.jpg',
      'Taglia Unghie per Cani': '/assets/images/taglia-unghie.jpg',
      'Cuccia per Cani': '/assets/images/cuccia.jpg',
      'Spazzola per Cani': '/assets/images/spazzola.jpg',
      'Pettorina Comfort per Cani': '/assets/images/pettorina.jpg',
      'Museruola per Cani': '/assets/images/museruola.jpg',
      'Guinzaglio Retrattile per Cani': '/assets/images/guinzaglio.jpg',
      'Collare Regolabile per Cani': '/assets/images/collare-regolabile.jpg',
      'Crocchette per Cani di Taglia Media': '/assets/images/crocchette-cani-taglia-media.jpg',
      'Cuscino Comodo per Cani': '/assets/images/cuscino.jpg',
    };
    return images[productName] || '/assets/images/default.jpg'; // Usa un'immagine di default se non è specificata
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

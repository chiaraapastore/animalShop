import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { CartService } from "../services/cart.service";
import { AuthenticationService } from "../auth/authenticationService";
import {ToastrService} from "ngx-toastr";

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
    private auth: AuthenticationService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadCartProducts();
  }

  async loadCartProducts(): Promise<void> {
    try {
      const user = await this.auth.getLoggedInUser();
      if (user) {
        const username = user.username || 'Email non disponibile';
        this.cartService.getCartProducts(username).subscribe({
          next: (products) => {
            const savedCart = localStorage.getItem('cart');
            const parsedCart = savedCart ? JSON.parse(savedCart) : {};

            this.cartItems = products.map(product => {
              const savedQuantity = parsedCart[product.id]?.quantity || 1;
              return {
                product: {
                  ...product,
                  imageUrl: this.getImageUrlForProduct(product.productName) // Assegna l'immagine corretta
                },
                quantity: savedQuantity
              };
            });
          },
          error: (error) => {
            console.error("Errore durante il caricamento dei prodotti nel carrello:", error);
          }
        });
      }
    } catch (error) {
      console.error("Errore durante il recupero dell'utente autenticato:", error);
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
    try {
      const user = await this.auth.getLoggedInUser();
      if (user) {
        const productId = item.product.id;

        // Aggiorna immediatamente la lista dei prodotti nel carrello
        this.cartItems = this.cartItems.filter(cartItem => cartItem.product.id !== productId);

        // Effettua la chiamata API per la rimozione del prodotto
        this.cartService.removeProductFromCart(productId).subscribe({
          next: () => {
            this.toastr.success('Prodotto rimosso dal carrello con successo', 'Successo');
          },
          error: (error) => {
            console.error('Errore durante la rimozione del prodotto:', error);
            this.toastr.error('Errore durante la rimozione del prodotto', 'Errore');
            this.loadCartProducts(); // Ricarica il carrello in caso di errore
          }
        });
      } else {
        this.toastr.warning('Effettua il login per modificare il carrello', 'Attenzione');
      }
    } catch (error) {
      console.error('Errore durante il recupero dell\'utente autenticato:', error);
    }
  }

  async updateQuantity(item: any, maxQuantity: number): Promise<void> {
    try {
      const user = await this.auth.getLoggedInUser();
      if (user) {
        const username = user.username || 'Email non disponibile';
        if (item.quantity < maxQuantity) {
          this.cartService.updateProductQuantity(item.product.id, item.quantity + 1, username).subscribe({
            next: () => {
              item.quantity++;
              this.saveCartToLocalStorage();
              console.log('Quantità aggiornata con successo');
            },
            error: (error) => {
              console.error('Errore durante l\'aggiornamento della quantità:', error);
              this.toastr.error('Errore durante l\'aggiornamento della quantità', 'Errore');
            }
          });
        } else {
          this.toastr.warning('Quantità massima disponibile raggiunta', 'Attenzione');
        }
      } else {
        this.toastr.warning('Utente non autenticato. Effettua il login.', 'Attenzione');
      }
    } catch (error) {
      console.error('Errore durante il recupero dell\'utente autenticato:', error);
    }
  }

  async decreaseQuantity(item: any): Promise<void> {
    try {
      const user = await this.auth.getLoggedInUser();
      if (user) {
        const username = user.username || 'Email non disponibile';
        if (item.quantity > 1) {
          this.cartService.updateProductQuantity(item.product.id, item.quantity - 1, username).subscribe({
            next: () => {
              item.quantity--;
              this.saveCartToLocalStorage();
              console.log('Quantità aggiornata con successo');
            },
            error: (error) => {
              console.error('Errore durante l\'aggiornamento della quantità', error);
              this.toastr.error('Errore durante l\'aggiornamento della quantità', 'Errore');
            }
          });
        } else {
          this.toastr.warning('Quantità minima raggiunta', 'Attenzione');
        }
      } else {
        this.toastr.warning('Utente non autenticato. Effettua il login.', 'Attenzione');
      }
    } catch (error) {
      console.error('Errore durante il recupero dell\'utente autenticato:', error);
    }
  }

  saveCartToLocalStorage(): void {
    const cartData = this.cartItems.reduce((acc, item) => {
      acc[item.product.id] = { quantity: item.quantity };
      return acc;
    }, {});
    localStorage.setItem('cart', JSON.stringify(cartData));
  }



  checkout(): void {
    localStorage.removeItem('cart');
    this.router.navigate(["/payment"]);
  }
}

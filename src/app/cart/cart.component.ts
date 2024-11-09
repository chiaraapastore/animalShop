import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { CartService } from "../services/cart.service";
import { Cart } from '../models/cart.model';

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

  constructor(private router: Router, private cartService: CartService) {}

  ngOnInit(): void {
    this.loadCartItems();
  }

  loadCartItems(): void {
    this.cartService.getCart().subscribe({
      next: (cart: Cart) => {
        this.cartItems = cart.cartItems; // Supponendo che `cartItems` contenga i prodotti
        console.log("Articoli caricati nel carrello:", this.cartItems);
      },
      error: (error) => {
        console.error("Errore nel caricamento degli articoli del carrello:", error);
      }
    });
  }

  removeFromCart(item: any): void {
    const index = this.cartItems.indexOf(item);
    if (index >= 0) {
      this.cartItems.splice(index, 1);
      // Potresti anche chiamare `this.cartService.removeItem(item)` se vuoi aggiornare il backend
    }
  }

  checkout(): void {
    this.router.navigate(["/payment"]);
  }
}

import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product.model';
import { Category } from '../models/category.model';
import { CartService } from "../services/cart.service";
import { KeycloakService } from "keycloak-angular";
import {Order} from "../models/order.model";
import {isPlatformBrowser} from "@angular/common";


@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  selectedCategory: string = '';
  page: number = 1;
  pageSize: number = 8;
  totalProducts: number = 0;
  tableSize: number[] = [5, 10, 20];
  sizes: string[] = ['S', 'M', 'L', 'XL'];
  filteredProducts: Product[] = [];
  selectedSort: string = 'default';
  sizeProduct: string = '';
  cartId: number | null = null;
  isAuthenticated: boolean = false;
  @Inject(PLATFORM_ID) private platformId: Object

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private keycloakService: KeycloakService,
    @Inject(PLATFORM_ID) platformId: Object // Inietta PLATFORM_ID nel costruttore
  ) {
    this.platformId = platformId;
  }

  ngOnInit(): void {
    this.checkAuthentication();
    this.loadCategories();
    this.loadProducts();
    console.log("Cart ID after ngOnInit:", this.cartId);
    if (this.cartId === null) {
      console.warn("Cart ID is null - Cart may not be initialized properly");
    }
  }

  async checkAuthentication(): Promise<void> {
    if (isPlatformBrowser(this.platformId)) {
      this.isAuthenticated = await this.keycloakService.isLoggedIn();
      if (this.isAuthenticated) {
        this.loadCart();  // Carica il carrello se l'utente è autenticato
      } else {
        await this.keycloakService.login();
      }
    }
  }

  loadCart(): void {
    const userId = this.getUserIdFromToken();
    if (userId) {
      this.cartService.getCartByUserId(userId).subscribe({
        next: (cart) => {
          if (!cart) {
            this.createCart(userId);  // Se il carrello non esiste, lo crea
          } else {
            this.cartId = cart.id;  // Altrimenti, imposta l'ID del carrello esistente
          }
        },
        error: (error) => console.error("Errore nel caricamento del carrello:", error)
      });
    }
  }

  createCart(userId: string): void {
    this.cartService.createCart(userId).subscribe({
      next: (cart) => {
        this.cartId = cart.id;  // Imposta il nuovo carrello creato
        console.log("Nuovo carrello creato con ID:", this.cartId);
      },
      error: (error) => console.error("Errore nella creazione del carrello:", error)
    });
  }

  addToCart(product: Product): void {
    if (this.cartId) {
      // Se il carrello esiste, aggiunge direttamente il prodotto
      this.cartService.addProductToCart(this.cartId, product.id.toString(), 1).subscribe({
        next: (cart) => console.log(`${product.productName} aggiunto al carrello.`, cart),
        error: err => console.error("Errore nell'aggiungere il prodotto al carrello:", err)
      });
    } else {
      // Se il carrello non esiste, lo crea prima di aggiungere il prodotto
      const userId = this.getUserIdFromToken();
      if (userId) {
        this.createCartAndAddProduct(userId, product);
      } else {
        console.warn("Impossibile aggiungere al carrello - User ID non trovato.");
      }
    }
  }

  createCartAndAddProduct(userId: string, product: Product): void {
    this.cartService.createCart(userId).subscribe({
      next: (cart) => {
        this.cartId = cart.id;  // Imposta l'ID del nuovo carrello
        console.log("Nuovo carrello creato con ID:", this.cartId);

        // Dopo aver creato il carrello, aggiunge il prodotto
        this.cartService.addProductToCart(this.cartId, product.id.toString(), 1).subscribe({
          next: (updatedCart) => console.log(`${product.productName} aggiunto al nuovo carrello.`, updatedCart),
          error: err => console.error("Errore nell'aggiungere il prodotto al nuovo carrello:", err)
        });
      },
      error: (error) => console.error("Errore nella creazione del carrello:", error)
    });
  }

  loadCategories(): void {
    this.productService.getCategories().subscribe({
      next: (categories: Category[]) => {
        this.categories = categories;
      },
      error: err => console.error('Errore nel caricamento delle categorie:', err)
    });
  }

  loadProducts(): void {
    const sortField = this.selectedSort === 'priceAsc' ? 'price' : this.selectedSort === 'priceDesc' ? 'price' : 'productName';
    const sortOrder = this.selectedSort === 'priceAsc' ? 'asc' : this.selectedSort === 'priceDesc' ? 'desc' : 'asc';

    this.productService.getProducts(this.page - 1, this.pageSize, sortField, sortOrder, this.selectedCategory, this.sizeProduct).subscribe({
      next: (response: any) => {
        this.products = response.content;
        this.totalProducts = response.totalElements;
        this.filteredProducts = [...this.products];
      },
      error: err => console.error('Errore nel caricamento dei prodotti:', err)
    });
  }

  onCategorySelect(categoryName: string): void {
    this.selectedCategory = categoryName;
    this.page = 1;
    this.loadProducts();
  }

  onSortChange(): void {
    this.loadProducts();
  }

  onFilterChange(): void {
    this.filteredProducts = this.products.filter((product) => product.sizeProduct === this.sizeProduct || this.sizeProduct === '');
    this.onSortChange();
  }

  goToPreviousPage(): void {
    if (this.page > 1) {
      this.page--;
      this.loadProducts();
    }
  }

  goToNextPage(): void {
    const lastPage = Math.ceil(this.totalProducts / this.pageSize);
    if (this.page < lastPage) {
      this.page++;
      this.loadProducts();
    }
  }

  onPageSizeChange(event: Event): void {
    this.pageSize = +(event.target as HTMLSelectElement).value;
    this.page = 1;
    this.loadProducts();
  }

  get totalPages(): number {
    return Math.ceil(this.totalProducts / this.pageSize);
  }

  checkout(): void {
    if (this.cartId !== null) {
      this.cartService.checkout(this.cartId).subscribe({
        next: (order: Order) => {
          console.log("Ordine creato con successo:", order);
        },
        error: err => console.error("Errore durante il checkout:", err)
      });
    } else {
      console.warn("Cart ID è null. Checkout non può essere completato.");
    }
  }


  getUserIdFromToken(): string | null {
    const tokenParsed: any = this.keycloakService.getKeycloakInstance().tokenParsed;
    return tokenParsed ? tokenParsed.sub : null;
  }
}

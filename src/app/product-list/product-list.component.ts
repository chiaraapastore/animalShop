import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product.model';
import { Category } from '../models/category.model';
import { CartService } from "../services/cart.service";
import { KeycloakService } from "keycloak-angular";
import {Order} from "../models/order.model";
import {AuthenticationService} from "../auth/authenticationService";
import {Cart} from "../models/cart.model";
import {isPlatformBrowser} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";


@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  searchProducts: Product[] = [];
  categories: Category[] = [];
  selectedCategory: string = '';
  page: number = 1;
  pageSize: number = 5;
  totalProducts: number = 0;
  tableSize: number[] = [5, 10, 20];
  sizes: string[] = ['S', 'M', 'L', 'XL'];
  cart: Cart | null = null;
  filteredProducts: Product[] = [];
  selectedSort: string = 'default';
  sizeProduct: string = '';
  cartId: number | null = null;
  isAuthenticated: boolean = false;
  searchKeyword: string = '';
  @Inject(PLATFORM_ID) private platformId: Object

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private keycloakService: KeycloakService,
    private auth: AuthenticationService,
    private route: ActivatedRoute,
    private router: Router,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.platformId = platformId;
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.searchKeyword = params['keyword'] || '';
      if (this.searchKeyword) {
        this.searchProductsByKeyword(this.searchKeyword);
      } else {
        this.loadProducts();
      }
    });
    this.loadCategories();
    this.checkAuthentication();
  }

  searchProductsByKeyword(keyword: string): void {
    if (!keyword.trim()) {
      this.resetFilters();
      return;
    }
    this.productService.searchProducts(keyword).subscribe({
      next: (products) => {
        this.searchProducts = products.map((product: Product) => ({
          ...product,
          imageUrl: this.getImageUrlForProduct(product.productName),
        }));
        this.filteredProducts = [...this.searchProducts];
        this.totalProducts = products.length;
      },
      error: (err) => {
        console.error('Errore durante il recupero dei prodotti cercati:', err);
        this.filteredProducts = [];
      },
    });
    this.router.navigate(['/shop'], {queryParams: {keyword}});
  }


  resetFilters(): void {
    this.searchKeyword = '';
    this.selectedCategory = '';
    this.selectedSort = 'default';
    this.sizeProduct = '';
    this.page = 1;
    this.filteredProducts = [];
    window.location.reload();
    this.router.navigate(['/shop'], { queryParams: {} }).then(() => {
      this.loadProducts();
    });
  }

  async checkAuthentication(): Promise<void> {
    if (isPlatformBrowser(this.platformId)) {
      this.isAuthenticated = await this.keycloakService.isLoggedIn();
      if (this.isAuthenticated) {
        this.loadCart();
      } else {
        await this.keycloakService.login();
      }
    }
  }


  loadCart(): void {}

  loadCategories(): void {
    this.productService.getCategories().subscribe({
      next: (categories: Category[]) => {
        this.categories = categories;
      },
      error: (err) => {
        console.error('Errore nel caricamento delle categorie:', err);
        this.categories = [];
      },
    });
  }

  loadProducts(): void {
    const sortField = this.selectedSort === 'priceAsc' ? 'price' : this.selectedSort === 'priceDesc' ? 'price' : 'productName';
    const sortOrder = this.selectedSort === 'priceAsc' ? 'asc' : this.selectedSort === 'priceDesc' ? 'desc' : 'asc';

    this.productService.getProducts(this.page - 1, this.pageSize, sortField, sortOrder, this.selectedCategory, this.sizeProduct)
      .subscribe({
        next: (response: any) => {
          if (response.content && Array.isArray(response.content)) {
            this.products = response.content.map((product: Product) => ({
              ...product,
              imageUrl: this.getImageUrlForProduct(product.productName),
            }));
            this.filteredProducts = [...this.products];
            this.totalProducts = response.totalElements || 0;
          } else {
            console.error('La risposta non contiene un array valido:', response);
            this.products = [];
            this.filteredProducts = [];
          }
        },
        error: (err) => {
          console.error('Errore nel caricamento dei prodotti:', err);
          this.products = [];
          this.filteredProducts = [];
        },
      });
  }

  async addToCart(productId: string, quantity: number = 1): Promise<void> {
    const user = await this.auth.getLoggedInUser();
    if (user) {
      const username = user.username || 'Email non disponibile';
      this.cartService.addProductToCart(productId, quantity, username).subscribe({
        next: (cart) => {
          console.log('Prodotto aggiunto al carrello con successo:', cart);
        },
        error: (err) => {
          console.error('Errore durante l\'aggiunta del prodotto al carrello:', err);
        }
      });
    } else {
      console.warn('Utente non autenticato. Effettua il login per aggiungere prodotti al carrello.');
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
      'Cuscino Comodo per Cani': '/assets/images/cuscino.jpg'
    };
    return images[productName] || '/assets/images/default.jpg'; // Usa un'immagine di default se non è specificata
  }

  onCategorySelect(categoryName: string): void {
    this.selectedCategory = categoryName;
    this.page = 1;
    this.loadProducts();
  }

  onFilterChange(): void {
    this.filteredProducts = this.products.filter((product) => product.sizeProduct === this.sizeProduct || this.sizeProduct === '');
    this.onSortChange();
  }

  onSortChange(): void {
    this.page = 1;
    this.loadProducts();
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
    return Math.ceil(this.totalProducts / this.pageSize) || 1; // Restituisci almeno 1 pagina
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
}

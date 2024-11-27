import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product.model';
import { ToastrService } from 'ngx-toastr';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent implements OnInit {
  products: Product[] = [];
  newProduct: Product = {
    id: 0,
    productName: '',
    price: 0,
    description: '',
    availableQuantity: 0,
    categoryName: '',
    sizeProduct: '',
    imageUrl: '',
    quantity: 0,
    category: { id: 0, categoryName: '', countProduct: 0 }
  };
  isAdmin: boolean = false; // Controlla se l'utente è admin
  categoryId: number = 1;
  page: number = 0;
  pageSize: number = 1000; // Numero elevato per caricare tutti i prodotti
  selectedSort: string = 'productName';
  selectedCategory: string = '';
  filteredProducts: Product[] = [];
  totalProducts: number = 0;

  constructor(
    private productService: ProductService,
    private toastr: ToastrService,
    private keycloakService: KeycloakService
  ) {}

  ngOnInit(): void {
    this.checkRole();
    this.loadProducts();
  }

  checkRole(): void {
    const roles = this.keycloakService.getUserRoles();
    this.isAdmin = roles.includes('admin');
    console.log('Ruolo admin:', this.isAdmin);
  }

  loadProducts(): void {
    const sortField =
      this.selectedSort === 'priceAsc'
        ? 'price'
        : this.selectedSort === 'priceDesc'
          ? 'price'
          : 'productName';
    const sortOrder = this.selectedSort === 'priceAsc' ? 'asc' : this.selectedSort === 'priceDesc' ? 'desc' : 'asc';

    this.productService.getProducts(this.page, this.pageSize, sortField, sortOrder, this.selectedCategory, this.newProduct.sizeProduct)
      .subscribe({
        next: (response: any) => {
          if (response.content && Array.isArray(response.content)) {
            this.products = response.content.map((product: Product) => ({
              ...product,
              category: product.category || { id: 0, name: '' },
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
    return images[productName];
  }


  createProduct(): void {
    if (!this.isAdmin) return; // Solo gli admin possono aggiungere prodotti
    this.productService.createProduct(this.newProduct, this.categoryId).subscribe({
      next: () => {
        this.toastr.success('Prodotto creato con successo!', 'Creazione Completata');
        this.loadProducts();
      },
      error: (err) => {
        console.error('Errore nella creazione del prodotto:', err);
        this.toastr.error('Errore durante la creazione del prodotto.', 'Errore');
      },
    });
  }


  updateProductPrice(product: Product): void {
    const categoryId = product.category.id || this.categoryId; // Ottieni l'ID della categoria
    this.productService.updateProduct(product.id!, product, categoryId).subscribe({
      next: () => {
        this.toastr.success(
          'Prezzo di "${product.productName}" aggiornato a €${product.price.toFixed(2)}', 'Aggiornamento Prezzo'
      );
        this.loadProducts(); // Ricarica i prodotti per riflettere le modifiche
      },
      error: (err) => {
        console.error('Errore durante l\'aggiornamento del prezzo:', err);
        this.toastr.error('Errore durante l\'aggiornamento del prezzo.', 'Errore');
      },
    });
  }




  deleteProduct(productId: number): void {
    if (!this.isAdmin) return;
    this.productService.deleteProduct(productId).subscribe({
      next: () => {
        this.toastr.success('Prodotto eliminato con successo!', 'Eliminazione Completata');
        this.loadProducts();
      },
      error: (err) => {
        console.error('Errore durante l\'eliminazione del prodotto:', err);
        this.toastr.error('Errore durante l\'eliminazione del prodotto.', 'Errore');
      }
    });
  }

  editProduct(product: Product): void {
    this.newProduct = { ...product };
  }

  resetForm(): void {
    this.newProduct = {
      id: 0,
      productName: '',
      price: 0,
      description: '',
      availableQuantity: 0,
      categoryName: '',
      sizeProduct: '',
      imageUrl: '',
      quantity: 0,
      category: { id: 0, categoryName: '', countProduct: 0 }
    };
  }
}

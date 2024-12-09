import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product.model';
import { Category } from '../models/category.model';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-crea-prodotto',
  templateUrl: './crea-prodotto.component.html',
  styleUrls: ['./crea-prodotto.component.css']
})
export class CreaProdottoComponent implements OnInit {
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

  categories: Category[] = [];
  selectedCategory: Category | null = null;
  categoriesLoaded: boolean = false;

  constructor(
    private productService: ProductService,
    private toastr: ToastrService,
    private route: Router
  ) {}

  ngOnInit(): void {

    this.productService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        console.log('Categorie caricate:', this.categories);
        this.categoriesLoaded = true;
      },
      error: (err) => {
        console.error('Errore nel recupero delle categorie', err);
        this.toastr.error('Errore nel caricamento delle categorie.', 'Errore');
        this.categoriesLoaded = false;
      }
    });
  }

  createProduct(): void {
    console.log('Categoria selezionata prima della verifica:', this.selectedCategory);
    if (!this.selectedCategory) {
      this.toastr.warning('Seleziona una categoria valida.', 'Attenzione');
      return;
    }


    this.newProduct.category = this.selectedCategory;
    this.newProduct.categoryName = this.selectedCategory.categoryName;
    console.log('Categoria selezionata:', this.selectedCategory);
    console.log('Prodotto creato:', this.newProduct);

    if (this.isValidProduct(this.newProduct)) {
      console.log('Creazione prodotto: ', this.newProduct);


      this.productService.createProduct(this.newProduct, this.newProduct.category.id)
        .subscribe({
          next: (response) => {
            this.toastr.success('Prodotto creato con successo!', 'Creazione completata');
            this.route.navigate(['/admin']);
          },
          error: (err) => {
            console.error('Errore nella creazione del prodotto:', err);
            this.toastr.error('Errore durante la creazione del prodotto.', 'Errore');
          }
        });
    } else {

      this.toastr.warning('Per favore, completa tutti i campi obbligatori.', 'Attenzione');
    }

  }

  isValidProduct(product: Product): boolean {
    return (
      product.productName !== '' &&
      product.price > 0 &&
      product.imageUrl !== '' &&
      product.availableQuantity > 0 &&
      product.category.id > 0
    );
  }
}

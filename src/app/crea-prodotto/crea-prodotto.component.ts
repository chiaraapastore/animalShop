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
    category: { id: 0, categoryName: '', countProduct: 0 }  // Categoria inizialmente vuota
  };

  categories: Category[] = [];
  selectedCategory: Category | null = null;  // Oggetto categoria selezionato, inizialmente null
  categoriesLoaded: boolean = false; // Flag per indicare se le categorie sono state caricate

  constructor(
    private productService: ProductService,
    private toastr: ToastrService,
    private route: Router
  ) {}

  ngOnInit(): void {
    // Carica le categorie dal servizio
    this.productService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        console.log('Categorie caricate:', this.categories);  // Log delle categorie per debug
        this.categoriesLoaded = true; // Indica che le categorie sono state caricate
      },
      error: (err) => {
        console.error('Errore nel recupero delle categorie', err);
        this.toastr.error('Errore nel caricamento delle categorie.', 'Errore');
        this.categoriesLoaded = false; // Gestisci caso di errore
      }
    });
  }

  createProduct(): void {
    console.log('Categoria selezionata prima della verifica:', this.selectedCategory);

    // Verifica che una categoria sia selezionata
    if (!this.selectedCategory) {
      this.toastr.warning('Seleziona una categoria valida.', 'Attenzione');
      return;
    }

    // Assicurati che la categoria sia correttamente associata al prodotto
    this.newProduct.category = this.selectedCategory;
    this.newProduct.categoryName = this.selectedCategory.categoryName;  // Aggiungi il nome della categoria (se necessario)

    console.log('Categoria selezionata:', this.selectedCategory);

    // Verifica che i dati del prodotto siano validi
    if (this.isValidProduct(this.newProduct)) {
      console.log('Creazione prodotto: ', this.newProduct);

      // Chiamata al servizio per creare il prodotto
      this.productService.createProduct(this.newProduct, this.newProduct.category.id)
        .subscribe({
          next: (response) => {
            // Successo: mostra il messaggio di successo e naviga
            this.toastr.success('Prodotto creato con successo!', 'Creazione completata');
            this.route.navigate(['/admin']);
          },
          error: (err) => {
            console.error('Errore nella creazione del prodotto:', err);
            this.toastr.error('Errore durante la creazione del prodotto.', 'Errore');
          }
        });
    } else {
      // Mostra un avviso se i campi non sono validi
      this.toastr.warning('Per favore, completa tutti i campi obbligatori.', 'Attenzione');
    }
  }


  // Funzione di validazione del prodotto
  isValidProduct(product: Product): boolean {
    return (
      product.productName !== '' &&
      product.price > 0 &&
      product.imageUrl !== '' &&
      product.category.id > 0
    );
  }
}

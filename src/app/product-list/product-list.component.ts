import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product.model';
import { Category } from '../models/category.model';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  selectedCategory: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 8;
  totalProducts: number = 0; // Aggiunto per calcolare le pagine totali

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
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
    const page = this.currentPage - 1; // Backend inizia la paginazione da 0
    this.productService.getProducts(page, this.itemsPerPage, 'productName', 'asc', this.selectedCategory).subscribe({
      next: (response: any) => {
        this.products = response.content;
        this.totalProducts = response.totalElements;
      },
      error: err => console.error('Errore nel caricamento dei prodotti:', err)
    });
  }

}

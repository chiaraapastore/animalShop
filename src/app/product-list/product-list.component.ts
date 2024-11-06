import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product.model';
import { Category } from '../models/category.model';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  selectedCategory: string = '';
  isDropdownOpen = false;
  page = 0;
  size = 10;
  sortBy = 'productName';
  sortDir = 'asc';

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
  }

  loadCategories(): void {
    this.productService.getCategories().subscribe((categories: Category[]) => {
      this.categories = categories;
      console.log('Categorie caricate:', this.categories);
    });
  }

  loadProducts(): void {
    this.productService.getProducts(this.page, this.size, this.sortBy, this.sortDir, this.selectedCategory)
      .subscribe(
        (products: Product[]) => {
          this.products = products;
          console.log('Prodotti caricati:', this.products); // Questo log  dirà se i prodotti vengono effettivamente caricati
        },
        error => console.error('Errore nel caricamento dei prodotti:', error) // Questo log mostrerà eventuali errori
      );
  }


  onCategoryChange(category: string): void {
    this.selectedCategory = category;
    this.loadProducts();
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
}

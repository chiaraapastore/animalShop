import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productsUrl = 'http://localhost:8081/api/products/list';
  private categoriesUrl = 'http://localhost:8081/category/categories';

  constructor(private http: HttpClient) {}

  // Ottieni il token dal localStorage
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // Metodo per ottenere tutte le categorie
  getCategories(): Observable<Category[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Category[]>(this.categoriesUrl, { headers });
  }

  // Metodo per ottenere tutti i prodotti con paginazione e filtro
  getProducts(page: number, size: number, sortBy: string, sortDir: string, category?: string): Observable<Product[]> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy)
      .set('sortDir', sortDir);

    if (category) {
      params = params.set('category', category);
    }

    const headers = this.getAuthHeaders();
    return this.http.get<Product[]>(this.productsUrl, { headers, params });
  }
}

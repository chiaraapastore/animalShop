import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {catchError, Observable, of} from 'rxjs';
import { Product } from '../models/product.model';
import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productsUrl = 'http://localhost:8081/api/products/list';
  private categoriesUrl = 'http://localhost:8081/category/categories';
  private searchUrl = 'http://localhost:8081/api/products/search';

  constructor(private http: HttpClient) {}


  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.categoriesUrl);
  }

  getProducts(page: number, size: number, sortBy: string, sortDir: string, category?: string, sizeProduct?: string): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy)
      .set('sortDir', sortDir);

    if (category) {
      params = params.set('category', category);
    }

    if (sizeProduct) {
      params = params.set('sizeProduct', sizeProduct);
    }

    return this.http.get<any>(this.productsUrl, { params }).pipe(
      catchError((error) => {
        console.error('Errore durante il recupero dei prodotti:', error);
        return of({ content: [], totalElements: 0 }); // Risposta vuota in caso di errore
      })
    );
  }

  // Crea un nuovo prodotto
  createProduct(product: Product, categoryId: number): Observable<Product> {
    return this.http.post<Product>(`http://localhost:8081/api/products/create/${categoryId}`, product);
  }

  // Aggiorna un prodotto esistente
  updateProduct(productId: number, product: Product, categoryId: number): Observable<Product> {
    return this.http.put<Product>(`http://localhost:8081/api/products/${productId}/${categoryId}`, product);
  }



  // Elimina un prodotto
  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`http://localhost:8081/api/products/${id}`);
  }



  searchProducts(keyword: string): Observable<Product[]> {
    const params = new HttpParams().set('keyword', keyword);
    return this.http.get<Product[]>(this.searchUrl, { params });
  }


}

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
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


  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.categoriesUrl);
  }

  getProducts(page: number, size: number, sortBy: string, sortDir: string, category?: string, sizeProduct?: string): Observable<Product[]> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy)
      .set('sortDir', sortDir);

    if (category) {
      params = params.set('category', category);
    }

    if (sizeProduct) {
      params = params.set('sizeProduct', sizeProduct); // Aggiunge il filtro della taglia
    }

    return this.http.get<Product[]>(this.productsUrl, { params });
  }


}

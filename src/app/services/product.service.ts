import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private productsUrl = 'https://fakestoreapi.com/products';
  private productsCache: Product[] | null = null;
  private productByIdCache: { [id: number]: Product } = {};

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    if (this.productsCache) {
      return of(this.productsCache);
    }
    return this.http.get<Product[]>(this.productsUrl).pipe(
      tap((products) => (this.productsCache = products)),
      catchError(this.handleError)
    );
  }

  getProductById(id: number): Observable<Product> {
    // If the product with this ID is in cache, return it
    if (this.productByIdCache[id]) {
      return of(this.productByIdCache[id]);
    }

    return this.http.get<Product>(`${this.productsUrl}/${id}`).pipe(
      tap((product) => {
        this.productByIdCache[id] = product;
      }),
      catchError(this.handleError)
    );
  }

  public handleError(err: any): Observable<never> {
    let errorMessage = 'An unknown error occurred!';

    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred.
      errorMessage = `Client-side error: ${err.error.message}`;
    } else {
      // A backend server error occurred.
      switch (err.status) {
        case 404:
          errorMessage = 'Product not found!';
          break;
        case 403:
          errorMessage = 'You do not have permission!';
          break;
        case 500:
          errorMessage = 'A server-side error occurred!';
          break;
        default:
          errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
          break;
      }
    }
    // I like spaces between my logic blocks
    console.error(errorMessage);
    return new Observable<never>((subscriber) => {
      subscriber.error(errorMessage);
    });
  }
}

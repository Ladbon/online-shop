import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../models/product.model';
import { ProductService } from '../services/product.service';
import { map, filter, switchMap, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
})
export class ProductDetailsComponent implements OnInit {
  product$!: Observable<Product | null>;
  errorMessage!: string;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.product$ = this.route.paramMap.pipe(
      map((paramMap) => paramMap.get('productid')),
      filter((productId) => !!productId),
      switchMap((productId) => {
        const id = +productId!;
        return this.productService.getProductById(id).pipe(
          catchError((err) => {
            this.errorMessage = err.message;
            return of(null);
          })
        );
      })
    );
  }
}

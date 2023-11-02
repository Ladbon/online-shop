import { Component, OnDestroy, OnInit } from '@angular/core';
import { Product } from '../models/product.model';
import { ProductService } from '../services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  products!: Product[];
  allProducts!: Product[];

  // Error Message
  errorMessage!: string;

  // Pagination variables
  currentPage: number = 1;
  productsPerPage: number = 8;
  totalPages!: number;

  // Filter
  categories!: string[];
  selectedCategory: string = '';
  minPrice: number = 0;
  DEFAULT_MAX_PRICE = 1000;
  maxPrice: number = this.DEFAULT_MAX_PRICE;

  constructor(
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      takeUntil(this.destroy$);
      const page = +params['page'] || 1;
      this.currentPage = page;
    });

    this.productService
      .getProducts()
      .pipe(
        catchError((error) => {
          this.errorMessage =
            'There was a problem fetching the products. Please try again later.';
          console.error('Error fetching products:', error);
          throw error;
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((data) => {
        this.products = data;
        this.allProducts = data;
        this.categories = [
          ...new Set(this.products.map((product) => product.category)),
        ];
        this.maxPrice = Math.max(
          ...this.products.map((product) => product.price)
        );
        this.filterAndDisplayProducts();
      });
  }

  // Pagination
  public previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.filterAndDisplayProducts();
    }
  }

  public nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.filterAndDisplayProducts();
    }
  }

  private changePage(page: number): void {
    this.currentPage = page;
    this.filterAndDisplayProducts();
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: page },
      queryParamsHandling: 'merge',
      skipLocationChange: false,
    });
  }

  public filterAndDisplayProducts(): void {
    let filteredProducts = this.allProducts.filter(
      (product) =>
        (this.selectedCategory
          ? product.category === this.selectedCategory
          : true) &&
        product.price >= this.minPrice &&
        product.price <= this.maxPrice
    );

    this.totalPages = Math.ceil(filteredProducts.length / this.productsPerPage);

    const startIndex = (this.currentPage - 1) * this.productsPerPage;
    this.products = filteredProducts.slice(
      startIndex,
      startIndex + this.productsPerPage
    );
  }

  public resetFilters(): void {
    this.selectedCategory = '';
    this.minPrice = 0;
    this.maxPrice = this.DEFAULT_MAX_PRICE;
    this.currentPage = 1;
  }
}

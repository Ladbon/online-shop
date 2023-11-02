import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';

// import { HTTP_INTERCEPTORS } from '@angular/common/http';
// import { CachingInterceptor } from './caching.interceptor';

import { HttpClientModule } from '@angular/common/http';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductDetailsComponent } from './product-details/product-details.component';

const routes: Routes = [
  { path: '', redirectTo: '/products', pathMatch: 'full' },
  { path: 'products', component: ProductListComponent },
  { path: 'product/:productid', component: ProductDetailsComponent },
];

@NgModule({
  declarations: [AppComponent, ProductListComponent, ProductDetailsComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    [RouterModule.forRoot(routes)],
  ],
  exports: [RouterModule],
  providers: [] /*[
    { provide: HTTP_INTERCEPTORS, useClass: CachingInterceptor, multi: true },
  ]*/,
  bootstrap: [AppComponent],
})
export class AppModule {}

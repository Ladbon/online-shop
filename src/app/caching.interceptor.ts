// Jag ville testa en http injector för att dra ner på antalet requests men jag är inte helt säker att detta var rätt väg.
// Jag hellre kollar på NgRx då för bättre state management men jag hade inte tid. Tydligen fick jag bara 4-5t enligt Kevin.
/* 
import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class CachingInterceptor implements HttpInterceptor {
  private cache = new Map<string, any>();
  private readonly maxCacheSize = 50;
  private cacheOrder: string[];

  constructor() {
    this.cacheOrder = [];
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // If it's not a GET request, skip caching
    if (req.method !== 'GET') {
      return next.handle(req);
    }

    const cachedResponse = this.cache.get(req.urlWithParams);
    if (cachedResponse) {
      return of(cachedResponse.clone());
    }

    return next.handle(req).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          this.manageCacheSize();
          this.cache.set(req.urlWithParams, event);
          this.cacheOrder.push(req.urlWithParams); 
        }
      })
    );
  }

  private manageCacheSize() {
    if (this.cacheOrder.length >= this.maxCacheSize) {
      const oldestUrl = this.cacheOrder.shift(); 
      if (oldestUrl) {
        this.cache.delete(oldestUrl); 
      }
    }
  }
}
*/

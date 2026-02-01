import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { tap, catchError, switchMap, throwError, of } from 'rxjs';
import { CartList } from '../models/cart/cart-list';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly apiUrl = 'http://localhost:8080/api/carts';
  private http = inject(HttpClient);

  cartCount = signal<number>(0);

  constructor() {
    this.refreshCartCount();
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  private createCart() {
    return this.http.post<any>(`${this.apiUrl}/first-use`, {}, { headers: this.getHeaders() });
  }

  getCart() {
    return this.http.get<any>(this.apiUrl, { headers: this.getHeaders() }).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 404) {
          return of({ items: [] });
        }
        return throwError(() => error);
      })
    );
  }

  addItemToCart(productId: string, quantity: number) {
    const payload = {
      productId: productId,
      quantity: quantity
    };

    return this.http.post<any>(this.apiUrl, payload, { headers: this.getHeaders() }).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 404) {
          console.log('Carrito no encontrado. Creando uno nuevo automáticamente...');
          return this.createCart().pipe(
            switchMap(() => {
              return this.http.post<any>(this.apiUrl, payload, { headers: this.getHeaders() });
            })
          );
        }
        return throwError(() => error);
      }),
      tap(() => this.refreshCartCount())
    );
  }

  removeFromCart(cartItemId: number) {
    return this.http.delete<void>(`${this.apiUrl}/items/${cartItemId}`, { headers: this.getHeaders() }).pipe(
      tap(() => this.refreshCartCount())
    );
  }

  clearCart() {
    return this.http.delete<void>(this.apiUrl, { headers: this.getHeaders() }).pipe(
      tap(() => this.cartCount.set(0))
    );
  }

  private refreshCartCount() {
    const token = localStorage.getItem('token');
    if (!token) return;

    this.getCart().subscribe({
      next: (cart) => {
        const count = cart.items ? cart.items.length : 0;
        this.cartCount.set(count);
      },
      error: () => this.cartCount.set(0)
    });
  }
}
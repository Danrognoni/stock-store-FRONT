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
  cartProductIds = signal<Set<string>>(new Set());

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

  refreshCartCount() {
    this.getCart().subscribe({
      next: (cart) => {
        const items = cart?.items || [];

        const totalQuantity = items.reduce((acc: number, item: any) => {
            return acc + (item.quantity || 0);
        }, 0);

        this.cartCount.set(totalQuantity);

        const ids = items.map((item: any) => item.product.id.toString());
        this.cartProductIds.set(new Set(ids));
      },
      error: (err) => {
        console.warn('Usuario no autenticado o error de carrito', err.status);
        this.cartCount.set(0);
        this.cartProductIds.set(new Set());
      }
    });
  }

  preparePayment() {
    const url = `http://localhost:8080/api/mp/cart`;

    return this.http.post(url, {}, {
      headers: this.getHeaders(),
      responseType: 'text'
    });
  }


modifyCartItemQuantity(cartItemId: number, quantity: number) {
  const url = `${this.apiUrl}/items/${cartItemId}/${quantity}`;

  return this.http.patch(url, {});
}
}

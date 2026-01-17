import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { CartList } from '../models/cart/cart-list';
import { CartItemRequest } from '../models/cartItem/cart-item-request';

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

  getCart() {
    return this.http.get<CartList>(this.apiUrl);
  }

  addToCart(productId: string, quantity: number) {
    const body: CartItemRequest = { productId, quantity };
    return this.http.post<any>(this.apiUrl, body).pipe(
      tap(() => this.refreshCartCount())
    );
  }

  removeFromCart(cartItemId: number) {
    return this.http.delete<void>(`${this.apiUrl}/items/${cartItemId}`).pipe(
      tap(() => this.refreshCartCount())
    );
  }

  clearCart() {
    return this.http.delete<void>(this.apiUrl).pipe(
      tap(() => this.cartCount.set(0))
    );
  }

  private refreshCartCount() {
    this.getCart().subscribe({
      next: (cart) => {
        const count = cart.items ? cart.items.length : 0;
        this.cartCount.set(count);
      },
      error: () => this.cartCount.set(0)
    });
  }
}

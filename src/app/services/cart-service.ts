import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private apiUrl = 'http://localhost:8080/api/cart';


  private cartCountSubject = new BehaviorSubject<number>(0);
  cartCount$ = this.cartCountSubject.asObservable();

  constructor(private http: HttpClient) {

    this.refreshCartCount();
  }


  getCart(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${userId}`);
  }


  addToCart(userId: number, productId: number, quantity: number): Observable<any> {
    const body = { productId, quantity };
    return this.http.post(`${this.apiUrl}/${userId}/add`, body).pipe(
      tap(() => this.refreshCartCount(userId))
    );
  }


  removeFromCart(userId: number, cartItemId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${userId}/remove/${cartItemId}`).pipe(
      tap(() => this.refreshCartCount(userId))
    );
  }

  private refreshCartCount(userId?: number) {
    if(!userId) return;
    this.getCart(userId).subscribe({
      next: (cart: any) => {
        const count = cart.items ? cart.items.length : 0;
        this.cartCountSubject.next(count);
      },
      error: () => this.cartCountSubject.next(0)
    });
  }
}

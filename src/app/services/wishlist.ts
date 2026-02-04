import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, switchMap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private readonly apiUrl = 'http://localhost:8080/api/wishlists';
  private http = inject(HttpClient);

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  private createWishlist() {
    return this.http.post<any>(`${this.apiUrl}/first-use`, {}, { headers: this.getHeaders() });
  }

  addToWishlist(productId: string) {
    const url = `${this.apiUrl}/${productId}`;

    return this.http.post<any>(url, {}, { headers: this.getHeaders() }).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 404) {
          console.log('Wishlist no encontrada. Creando una nueva...');
          return this.createWishlist().pipe(
            switchMap(() => {
              return this.http.post<any>(url, {}, { headers: this.getHeaders() });
            })
          );
        }
        return throwError(() => error);
      })
    );
  }
  
  getWishlist() {
    return this.http.get<any>(this.apiUrl, { headers: this.getHeaders() });
  }

  removeFromWishlist(productId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${productId}`);
  }
}
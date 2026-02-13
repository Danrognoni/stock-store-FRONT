import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class OnlineOrderService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/online-orders';

  getMyOrders() {
    return this.http.get<any[]>(`${this.apiUrl}/my-orders`);
  }

  getOrders(page: number, size: number): Observable<any> {
    let params = new HttpParams().set('page', page.toString()).set('size', size.toString());
    return this.http.get<any>(this.apiUrl, { params });
  }
  
}
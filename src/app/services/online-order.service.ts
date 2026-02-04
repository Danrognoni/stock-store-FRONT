import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class OnlineOrderService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/online-orders';
  getMyOrders() {
    return this.http.get<any[]>(`${this.apiUrl}/my-orders`);
  }
}
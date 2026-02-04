import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion'; 
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips'; 
import { OnlineOrderService } from '../../../services/online-order.service';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatExpansionModule, MatIconModule, MatChipsModule],
  templateUrl: './order-list.html',
  styles: [`
    .container { padding: 20px; max-width: 800px; margin: 0 auto; }
    .order-header { display: flex; justify-content: space-between; width: 100%; align-items: center; margin-right: 15px; }
    .order-info { display: flex; flex-direction: column; }
    .total-price { font-weight: bold; color: #2e7d32; }
  `]
})
export class OrderListComponent implements OnInit {
  private orderService = inject(OnlineOrderService);
  orders = signal<any[]>([]);

  ngOnInit() {
    this.orderService.getMyOrders().subscribe({
      next: (data) => this.orders.set(data),
      error: (err) => console.error(err)
    });
  }
}
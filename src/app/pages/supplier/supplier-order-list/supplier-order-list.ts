import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { supplierService } from '../../../services/supplier';
import { MatIconModule } from '@angular/material/icon'; 
import { SupplierOrder } from '../../../models/supplier/supplier-order';

@Component({
  selector: 'app-supplier-order-list',
  standalone: true,
  imports: [CommonModule, MatIconModule], 
  templateUrl: './supplier-order-list.html',
  styleUrls: ['./supplier-order-list.css']
})
export class SupplierOrderListComponent implements OnInit {
  
  private supplierService = inject(supplierService);
  
  public orders = signal<SupplierOrder[]>([]);
  public page = signal<number>(0);
  public size = signal<number>(10);
  public totalElements = signal<number>(0);

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders() {
    this.supplierService.getSupplierOrders(this.page(), this.size()).subscribe({
      next: (data: any) => {
        if (data.content) {
          this.orders.set(data.content);
          this.totalElements.set(data.totalElements);
        } else if (Array.isArray(data)) {
          this.orders.set(data);
        }
      },
      error: (e) => console.error('Error al cargar pedidos', e)
    });
  }

  toggleStatus(order: SupplierOrder) {
    const nuevoEstado = order.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
    
    this.supplierService.updateOrderStatus(order.id, nuevoEstado).subscribe({
      next: () => {
        this.orders.update(lista => lista.map(item => 
          item.id === order.id ? { ...item, status: nuevoEstado } : item
        ));
      },
      error: (e) => console.error('Error al actualizar estado', e)
    });
  }
}
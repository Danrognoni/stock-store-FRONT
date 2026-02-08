import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, NavigationEnd } from '@angular/router'; 
import { filter, Subscription } from 'rxjs';

import { OnlineOrderService } from '../../services/online-order.service';
import { InventoryItemDet } from '../../models/inventoryItem/inventory-item-det';
import { ProductService } from '../../services/product';
import { supplierService } from '../../services/supplier';
import { inventoryItemService } from '../../services/inventory-item';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit, OnDestroy {

  private productService = inject(ProductService);
  private supplierService = inject(supplierService);
  private inventoryService = inject(inventoryItemService);
  private orderService = inject(OnlineOrderService);
  private router = inject(Router);

    pageIndex = signal<number>(0);
  pageSize = signal<number>(18);

  public totalProductos = signal<number>(0);
  public totalProveedores = signal<number>(0);
  public alertasStock = signal<number>(0);
  public alertasVencimiento = signal<number>(0);
  public pedidosTotales = signal<number>(0);

  private routerSubscription?: Subscription;

  ngOnInit(): void {
    this.cargarDashboard();

    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.cargarDashboard();
    });
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  cargarDashboard() {
    this.productService.getProducts(this.pageIndex(), this.pageSize()).subscribe({
      next: (data: any) => {
        if (data.totalElements !== undefined) {
          this.totalProductos.set(data.totalElements);
        } else if (Array.isArray(data)) {
          this.totalProductos.set(data.length);
        } else if (data.content && Array.isArray(data.content)) {
          
             this.totalProductos.set(data.content.length); 
        }
      },
      error: (e) => console.error('Error productos', e)
    });

    this.supplierService.getSuppliers(this.pageIndex(), this.pageSize()).subscribe({
      next: (data: any) => {
        if (data.totalElements !== undefined) {
          this.totalProveedores.set(data.totalElements);
        } 
        else if (Array.isArray(data)) {
          this.totalProveedores.set(data.length);
        } 
        else if (data.content && Array.isArray(data.content)) {
           this.totalProveedores.set(data.totalElements || data.content.length); 
        }
      },
      error: (e) => console.error('Error proveedores', e)
    });

    this.inventoryService.getAll().subscribe({
      next: (items: InventoryItemDet[]) => {
        
        const bajoStock = items.filter(item => item.stock < 15).length;
        this.alertasStock.set(bajoStock);

        const hoy = new Date();
        const limite = new Date();
        limite.setDate(hoy.getDate() + 45);

        const porVencer = items.filter(item => {
          if(!item.expireDate) return false;
          const fecha = new Date(item.expireDate);
          return fecha >= hoy && fecha <= limite;
        }).length;
        this.alertasVencimiento.set(porVencer);
      },
      error: (e) => console.error('Error inventario', e)
    });

    this.orderService.getOrders(this.pageIndex(), this.pageSize()).subscribe({
      next: (data: any) => {
        if (data.totalElements !== undefined) {
          this.pedidosTotales.set(data.totalElements);
        } else if (Array.isArray(data)) {
           this.pedidosTotales.set(data.length);
        }
      },
      error: (e) => console.error('Error ordenes', e)
    });
  }
}
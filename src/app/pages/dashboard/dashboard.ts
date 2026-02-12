import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, NavigationEnd } from '@angular/router';
import { filter, Subscription } from 'rxjs';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions, ChartData } from 'chart.js';


import { supplierService } from '../../services/supplier'; 
import { ProductService } from '../../services/product';
import { inventoryItemService } from '../../services/inventory-item';
import { InventoryItemDet } from '../../models/inventoryItem/inventory-item-det';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    RouterLink, 
    MatCardModule, 
    MatIconModule,
    MatButtonModule,
    BaseChartDirective
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit, OnDestroy {

  private productService = inject(ProductService);
  private supplierService = inject(supplierService);
  private inventoryService = inject(inventoryItemService);
  private router = inject(Router);

  pageIndex = signal<number>(0);
  pageSize = signal<number>(1); 

  public totalProductos = signal<number>(0);
  public totalProveedores = signal<number>(0);
  public alertasStock = signal<number>(0);
  public alertasVencimiento = signal<number>(0);
  
  public totalPedidosProveedores = signal<number>(0);

  public barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1e293b',
        padding: 12,
        cornerRadius: 8,
        displayColors: false,
        callbacks: { label: (context) => ` Total: ${context.raw}` }
      }
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#64748b', font: { weight: 'bold' } } },
      y: { beginAtZero: true, grid: { color: '#f1f5f9' }, ticks: { stepSize: 1, color: '#64748b' } }
    }
  };

  public barChartData: ChartData<'bar'> = {
    labels: ['Productos', 'Proveedores', 'Pedidos Prov.'], 
    datasets: [
      {
        data: [0, 0, 0],
        backgroundColor: ['#3b82f6', '#a855f7', '#f97316'],
        borderRadius: 8,
        barThickness: 50,
      }
    ]
  };

  private routerSubscription?: Subscription;

  ngOnInit(): void {
    this.cargarDashboard();
    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => this.cargarDashboard());
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) this.routerSubscription.unsubscribe();
  }

  cargarDashboard() {
    //  Cargar Productos
    this.productService.getProducts(0, 100).subscribe({
      next: (data: any) => {
        const total = data.totalElements || (data.content ? data.content.length : 0);
        this.totalProductos.set(total);
        this.actualizarGrafico();
      }
    });

   //cargar Proveedores
    this.supplierService.getSuppliers(0, 100).subscribe({
      next: (data: any) => {
        const total = data.totalElements || (data.content ? data.content.length : 0);
        this.totalProveedores.set(total);
        this.actualizarGrafico();
      }
    });

    // cargar pedidos
    this.supplierService.getSupplierOrders(0,100).subscribe({
      next: (data: any) => {
        console.log('📦 Respuesta API Pedidos:', data); 

        let total = 0;

        if (data.totalElements !== undefined) {
          total = data.totalElements;
        } else if (Array.isArray(data)) {
          total = data.length;
        } else if (data.content && Array.isArray(data.content)) {
           total = data.content.length; 
        } else if (data.total !== undefined) {
          total = data.total;
        }

        this.totalPedidosProveedores.set(total);
        this.actualizarGrafico();
      },
      error: (e) => {
        console.error('❌ Error cargando pedidos:', e);
        this.totalPedidosProveedores.set(0); 
      }
    });

    this.inventoryService.getAll().subscribe({
      next: (items: InventoryItemDet[]) => {
        const bajoStock = items.filter(item => item.stock < 15).length;
        this.alertasStock.set(bajoStock);

        const hoy = new Date();
        const limite = new Date();
        limite.setDate(hoy.getDate() + 45);

        const porVencer = items.filter(item => {
          if (!item.expireDate) return false;
          const fecha = new Date(item.expireDate);
          return fecha >= hoy && fecha <= limite;
        }).length;
        this.alertasVencimiento.set(porVencer);
      }
    });
  }

  private actualizarGrafico() {
    this.barChartData = {
      ...this.barChartData,
      datasets: [{
        ...this.barChartData.datasets[0],
        data: [
          this.totalProductos(),
          this.totalProveedores(),
          this.totalPedidosProveedores() 
        ]
      }]
    };
  }
}
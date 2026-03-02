import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonToggleModule, MatButtonToggleGroup } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';

import { inventoryItemService } from '../../../services/inventory-item';
import { InventoryItemDet } from '../../../models/inventoryItem/inventory-item-det';
import { RouterLink } from '@angular/router';
import { Toast } from '../../category/category-form-component/category-form-component';

@Component({
  selector: 'app-inventory-item-list',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonToggleModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatTableModule,
    MatPaginatorModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './inventory-item-list.html',
  styleUrl: './inventory-item-list.css'
})


export class InventoryItemList implements OnInit {
  private inventoryService = inject(inventoryItemService);

  @ViewChild('filterGroup') filterGroup!: MatButtonToggleGroup;
  notification = signal<Toast | null>(null);

  items = signal<InventoryItemDet[]>([]);
  loading = signal<boolean>(false);
  searchTerm: string = '';

  displayedColumns: string[] = ['id', 'product', 'stock', 'price', 'actions', 'expireDate'];
  private searchTimer: any;

  ngOnInit() {
    this.loadAll();
  }

  onSearch(input: string) {
    const term = input.trim();

    if (this.searchTimer) clearTimeout(this.searchTimer);

    this.searchTimer = setTimeout(() => {
      if (!term) {
        this.loadAll();
      } else {

        this.inventoryService.searchInventoryItem(term).subscribe({
          next: (data) => {
            const list = data.content || [];
            this.items.set(list);
          },
          error: (e) => console.error(e)
        });
      }
    }, 400);
  }


  onFilterChange(filter: string) {
    this.searchTerm = '';
    this.loading.set(true);

    switch (filter) {
      case 'low':
        this.inventoryService.getLowStockItems(15).subscribe(this.handleResponse());
        break;
      case 'top':
        this.inventoryService.getTopStockItems().subscribe(this.handleResponse());
        break;
      default:
        this.loadAll();
        break;
    }
  }

  private handleResponse() {
    return {
      next: (data: any) => {
        let list = Array.isArray(data) ? [...data] : [...(data.content || [])];

        const now = new Date().getTime();
        list.sort((a: any, b: any) => {
          if (!a.expireDate && !b.expireDate) return 0;
          if (!a.expireDate) return 1;
          if (!b.expireDate) return -1;

          const diffA = Math.abs(new Date(a.expireDate).getTime() - now);
          const diffB = Math.abs(new Date(b.expireDate).getTime() - now);
          return diffA - diffB;
        });

        this.items.set(list);
        this.loading.set(false);
      },
      error: (e: any) => {
        console.error(e);
        this.loading.set(false);
      }
    };
  }

  loadAll() {
    this.loading.set(true);
    this.inventoryService.getAll().subscribe(this.handleResponse());
  }

  deleteItem(id: string) {
    if (confirm('Eliminar este item de inventario?')) {
      this.inventoryService.deleteInventoryItem(id).subscribe({
        next: () => {
          this.showToast('item de inventario eliminado con exito', 'success');
          this.items.update((item) => item.filter((p) => p.id !== id));
        },
        error: (error) => {
          this.showToast('Error al eliminar el item de inventario', 'error');
        },
      });
    }
  }


  private showToast(message: string, type: 'success' | 'error') {
    this.notification.set({ message, type });
    setTimeout(() => {
      this.notification.set(null);
    }, 3000);
  }
}
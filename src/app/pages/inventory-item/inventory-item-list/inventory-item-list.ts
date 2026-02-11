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
import { MatCard } from '@angular/material/card';
import { RouterLink } from '@angular/router';

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
    MatCard,
    RouterLink
  ],
  templateUrl: './inventory-item-list.html',
  styleUrl: './inventory-item-list.css'
})
export class InventoryItemList implements OnInit {

  private inventoryService = inject(inventoryItemService);

  @ViewChild('filterGroup') filterGroup!: MatButtonToggleGroup;

  items = signal<InventoryItemDet[]>([]);
  loading = signal<boolean>(false);
  searchTerm: string = '';

  displayedColumns: string[] = ['id', 'product', 'stock', 'price', 'actions'];

  ngOnInit() {
    this.loadAll();
  }

  onSearch(term: string) {
    this.searchTerm = term;

    if (this.filterGroup) {
      this.filterGroup.value = 'all';
    }

    if (!term) {
      this.loadAll();
      return;
    }

    this.loading.set(true);
    this.inventoryService.searchInventoryItem(term).subscribe({
      next: (data) => {
        const list = Array.isArray(data) ? data : (data.content || []);
        this.items.set(list);
        this.loading.set(false);
      },
      error: (e) => {
        console.error(e);
        this.loading.set(false);
      }
    });
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

      case 'all':
      default:
        this.loadAll();
        break;
    }
  }

  private handleResponse() {
    return {
      next: (data: any) => {
        const list = Array.isArray(data) ? data : (data.content || []);
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
}

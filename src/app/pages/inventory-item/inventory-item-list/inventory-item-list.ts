import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatDividerModule } from '@angular/material/divider';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common'; // Usually needed for dates

// Verify these file paths exist.
// If your service class is named 'InventoryItemService' (Capital I), rename the import alias or the usage.
import { inventoryItemService } from '../../../services/inventory-item';
import { InventoryItemDet } from '../../../models/inventoryItem/inventory-item-det';

@Component({
  selector: 'app-inventory-item-list',
  templateUrl: './inventory-item-list.html',
  styleUrl: './inventory-item-list.css', // Create this file or remove this line
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatPaginatorModule, MatDividerModule, RouterLink],
})
export class InventoryItemList implements OnInit {
  totalElements = signal<number>(0);
  pageIndex = signal<number>(0);
  pageSize = signal<number>(10);

  private inventoryItemService = inject(inventoryItemService);

  inventoryItems = signal<InventoryItemDet[]>([]);
  private searchTimer: any;

  ngOnInit(): void {
    this.getInventoryItems();
  }

  getInventoryItems() {
    this.inventoryItemService.getInventoryItems(this.pageIndex(), this.pageSize()).subscribe({
      next: (data: any) => {
        this.inventoryItems.set(data.content);
        this.totalElements.set(data.page.totalElements);
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }

  onSearch(input: string) {
    if (this.searchTimer) {
      clearTimeout(this.searchTimer);
    }
    this.searchTimer = setTimeout(() => {
      if (input.trim() === '') {
        this.getInventoryItems();
      } else {
        this.pageIndex.set(0);
        this.searchInventoryItems(input);
      }
    }, 300);
  }

  searchInventoryItems(input: string) {
    this.inventoryItemService.searchInventoryItem(input).subscribe({
      next: (data: any) => {
        this.inventoryItems.set(data.content);
        if(data.page){
          this.totalElements.set(data.page.totalElements);
        } else {
          this.totalElements.set(data.content.length);
        }
      },
      error: (error: any) => console.log(error),
    });
  }

  deleteInventoryItem(id: string) {
    if (confirm('¿Eliminar este item?')) {
      this.inventoryItemService.deleteInventoryItem(id).subscribe({
        next: () => {
          alert('Item eliminado con éxito');
          this.inventoryItems.update((items) => items.filter((i) => i.id !== id));
        },
        error: (error: any) => {
          alert('Error al eliminar el item');
          console.error(error);
        },
      });
    }
  }

  changePage(event: PageEvent) {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.getInventoryItems();
  }
}

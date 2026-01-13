import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { inventoryItemService } from '../../services/inventory-item';
import { InventoryItemDet } from '../../models/inventoryItem/inventory-item-det';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-inventory-item-list',
  imports: [MatCardModule, MatButtonModule],
  templateUrl: './inventory-item-list.html',
  styleUrl: './inventory-item-list.css',
})
export class InventoryItemList {

   totalElements = signal<number>(0);
  pageIndex = signal<number>(0);
  pageSize = signal<number>(18);

  inventoryItemService = inject(inventoryItemService);
  inventoryItems = signal<InventoryItemDet[]>([]);
  private searchTimer: any;

  ngOnInit(): void {
    this.getInventoryItems();
  }

  getInventoryItems(){
    this.inventoryItemService.getInventoryItems(this.pageIndex(), this.pageSize()).subscribe({
      next: (data) => {
        this.inventoryItems.set(data.content);
        this.totalElements.set(data.page.totalElements);
      },
      error: (error) => {
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
      next: (data) => {
        this.inventoryItems.set(data.content);
        if(data.page){
          this.totalElements.set(data.page.totalElements);
        }
        else{
          this.totalElements.set(data.content.length);
        }
      },
      error: (error) => console.log(error),
    });
  }

    deleteInventoryItem(id: string) {
    if (confirm('Eliminar este inventoryItem?')) {
      this.inventoryItemService.deleteInventoryItem(id).subscribe({
        next: () => {
          alert('Inventory-item eliminado con exito');
          this.inventoryItems.update((inventoryItems) => inventoryItems.filter((p) => p.id !== id));
        },
        error: (error) => {
          alert('Error al eliminar el inventory-item');
        },
      });
    }
  }

  changePage(event: PageEvent) {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.getInventoryItems();
  }

  loadInventory(date: string, id: string) {
    this.inventoryItemService.getInventoryItemsByProduct(date, id).subscribe({
      next: (data) => {
        this.inventoryItems = data;
        console.log('Items cargados:', data);
      },
      error: (err) => {
        console.error('Error al cargar inventario:', err);
      }
    });
  }

}



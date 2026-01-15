import { inventoryItemService } from './../../../services/inventory-item';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { single } from 'rxjs';
import { InventoryItemDet } from '../../../models/inventoryItem/inventory-item-det';

@Component({
  selector: 'app-inventory-item-detail',
  imports: [],
  templateUrl: './inventory-item-detail.html',
  styleUrl: './inventory-item-detail.css',
})
export class InventoryItemDetail {
  private router = inject(Router);
  public inventoryItemService = inject(inventoryItemService);
  public inventoryitem = signal<InventoryItemDet|null>(null);
  private ruta = inject(ActivatedRoute);

  constructor(){}

  ngOnInit(){

  }

  getInventoryItemById(){
    const id = this.ruta.snapshot.paramMap.get('id');
    if(id){
      this.inventoryItemService.getInventoryItem(id).subscribe({
        next : ( data) =>{
          this.inventoryitem.set(data);
        },
        error :  (e) =>{
          console.error(e);

        }
      })
    }
  }

  getBack(){
    this.router.navigate(['/inventoryItem/inventoryItemList'])
  }
}

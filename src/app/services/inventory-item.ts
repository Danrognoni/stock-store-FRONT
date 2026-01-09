import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { InventoryItemRequest } from '../models/inventoryItem/inventory-item-request';

@Injectable({
  providedIn: 'root',
})
export class Product {
  readonly apiUrl = "localhost:8080/api/inventory-items";
  http = inject(HttpClient);

  getInventoryItems(page : number, size : number){
    let params = new HttpParams().set('page', page.toString()).set('size', size.toString());
    return this.http.get<any>(this.apiUrl, {params});
  }

  getInventoryItem(id : string){
    const url = `${this.apiUrl}/id/${id}`;
    return this.http.get<any>(url);
  }

  searchInventoryItem(name : string){
    const url = `${this.apiUrl}/${name}`;
    return this.http.get<any>(url);
  }

  postInventoryItem(data : InventoryItemRequest){
    return this.http.post<any>(this.apiUrl, data);
  }

  patchInventoryItem(id:string, data : Partial<InventoryItemRequest>){
    const url = `${this.apiUrl}/${id}`;
    return this.http.patch<any>(url, data);
  }

  deleteInventoryItem(id : string){
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete(url);
  }

  getInventoryItemsByProduct(date:string, id:string){
    const url = `${this.apiUrl}/${date}/product/${id}`;
    return this.http.get<any>(url);
  }

}

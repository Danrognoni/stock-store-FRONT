import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { InventoryItemRequest } from '../models/inventoryItem/inventory-item-request';
import { InventoryItemDet } from '../models/inventoryItem/inventory-item-det';

@Injectable({
  providedIn: 'root',
})
export class inventoryItemService {
  readonly apiUrl = "http://localhost:8080/api/inventory-items";
  http = inject(HttpClient);

  getInventoryItems(page : number, size : number){
    let params = new HttpParams().set('page', page.toString()).set('size', size.toString());
    return this.http.get<any>(this.apiUrl, {params});
  }

  getAll(): Observable<InventoryItemDet[]> {

    let params = new HttpParams().set('page', "0").set('size', "1000");

    return this.http.get<any>(this.apiUrl, {params}).pipe(
      map(response => {
        if (response && response.content) {
          return response.content as InventoryItemDet[];
        }
        if (Array.isArray(response)) {
          return response as InventoryItemDet[];
        }
        return [];
      })
    );
  }

  getExpiringItems(days: number = 30): Observable<InventoryItemDet[]> {
    const hoy = new Date();
    const limite = new Date();
    limite.setDate(hoy.getDate() + days);

    return this.getAll().pipe(
      map(items => items.filter(item => {
        if (!item.expireDate) return false;
        const fechaVenc = new Date(item.expireDate);
        return fechaVenc >= hoy && fechaVenc <= limite;
      }))
    );
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

  getLowStockItems(threshold: number = 10): Observable<InventoryItemDet[]> {
    let params = new HttpParams().set('limit', threshold.toString());
    return this.http.get<InventoryItemDet[]>(`${this.apiUrl}/low-stock`, { params });
  }

  getTopStockItems(): Observable<InventoryItemDet[]> {
    return this.http.get<InventoryItemDet[]>(`${this.apiUrl}/top-stock`);
  }
}

import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ProductRequest } from '../models/product/product-request';
import { SupplierRequest } from '../models/supplier/supplier-request';
import { SupplierOrder } from '../models/supplier/supplier-order';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Product {
  readonly apiUrl = "localhost:8080/api/suppliers";
  http = inject(HttpClient);

  getSuppliers(page : number, size : number){
    let params = new HttpParams().set('page', page.toString()).set('size', size.toString());
    return this.http.get<any>(this.apiUrl, {params});
  }

  getSupplier(id : string){
    const url = `${this.apiUrl}/id/${id}`;
    return this.http.get<any>(url);
  }

  searchSupplier(name : string){
    const url = `${this.apiUrl}/${name}`;
    return this.http.get<any>(url);
  }

  postSupplier(data : SupplierRequest){
    return this.http.post<any>(this.apiUrl, data);
  }

  patchSupplier(id:string, data : Partial<SupplierRequest>){
    const url = `${this.apiUrl}/${id}`;
    return this.http.patch<any>(url, data);
  }

  deleteSupplier(id : string){
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete(url);
  }

   searchSupplierByEmail(email : string){
    const url = `${this.apiUrl}/${email}`;
    return this.http.get<any>(url);
  }

  sendOrderToSupplier(items: SupplierOrder[], supplierId: number): Observable<void> {
    const url = `${this.apiUrl}/${supplierId}/send-order`;
    return this.http.post<void>(url, items);
  }
}

import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AddressRequest } from '../models/address/address-request';

@Injectable({
  providedIn: 'root',
})
export class AddressService {
  private readonly apiUrl = 'http://localhost:8080/api/addresses';
  private http = inject(HttpClient);

  addAddress(data: AddressRequest){
    return this.http.post<any>(this.apiUrl, data);
  }

  getAddresses(page: number, size:number){
    let params = new HttpParams().set('page', page.toString()).set('size', size.toString());
    return this.http.get<any>(this.apiUrl, {params});
  }

  getAddress(id:string){
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<any>(url);
  }

  updateAddress(id:string, data:Partial<AddressRequest>){
    const url = `${this.apiUrl}/${id}`;
    return this.http.patch<any>(url, data);
  }

  deleteAddress(id:string){
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<any>(url);
  }
}

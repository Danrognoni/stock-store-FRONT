import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CategoryRequest } from '../models/category/category-request';

@Injectable({
  providedIn: 'root',
})
export class Category {
  readonly apiurl = "localhost:8080/api/categories"
  http = inject(HttpClient)

  getCategories(page : number, size:number){
    let params = new HttpParams().set('page', page.toString()).set('size', size.toString());
    return this.http.get<any>(this.apiurl, {params});
  }

  getCategory(id:string){
    const url = `${this.apiurl}/id/${id}`;
    return this.http.get<any>(url);
  }

  searchCategory(name : string){
    const url = `${this.apiurl}/${name}`
    return this.http.get<any>(url);
  }

  postCategory(data:CategoryRequest){
    return this.http.post<any>(this.apiurl, data);
  }

  patchCategory(id:string, data : Partial<CategoryRequest>){
    const url = `${this.apiurl}/${id}`
    return this.http.patch<any>(url, data);
  }

  deleteCategory(id : string){
    const url = `${this.apiurl}/${id}`;
    return this.http.delete(url);
  }

}

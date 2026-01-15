import { Component, inject, signal } from '@angular/core';
import { supplierService } from '../../../services/supplier';
import { SupplierDet } from '../../../models/supplier/supplier-det';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-supplier-list',
  imports: [ MatCardModule,  MatButtonModule, MatPaginatorModule, RouterLink],
  templateUrl: './supplier-list.html',
  styleUrl: './supplier-list.css',
})
export class SupplierList {

  private supplierService = inject(supplierService);
  totalElements = signal<number>(0);
  pageIndex = signal<number>(0);
  pageSize = signal<number>(10);
  readonly supplier = signal<SupplierDet[]>([]);
  private searchTimer : any;


  ngOnInit(){
    return this.getSuppliers();
  }

  getSuppliers(){
    return this.supplierService.getSuppliers(this.pageIndex(), this.pageSize()).subscribe({
      next : (data)=>{
        this.supplier.set(data.content);
        this.totalElements.set(data.page.totalElements);
      },
      error : (e)=>{
        console.error(e);

      }
    })
  }

  onSearch(input : string){
    if(this.searchTimer){
      clearTimeout(this.searchTimer);
    }
    this.searchTimer = setTimeout(()=>{
      if(input.trim() === ''){
        this.getSuppliers();
      }else{
        this.searchTimer(0);
        this.searchSupplier(input);
      }

    }, 300
  )
  }

  searchSupplier(input: string){
    this.supplierService.searchSupplier(input).subscribe({
      next : (data) =>{
        this.supplier.set(data.content);
        if(data.page){
          this.totalElements.set(data.page.totalElements);
        }else{
          this.totalElements.set(data.content.length);
        }
      },
      error: ( e)=>{
        console.error(e);

      }
    })
  }


  deleteSupplier(id: string): void {
    if (confirm('¿Eliminar este proveedor?')) {
      this.supplierService.deleteSupplier(id).subscribe({
        next: () => {
          alert('Proveedor eliminado con éxito');
          this.supplier.update((list) => list.filter((s) => s.id !== id));
        },
        error: (e) => {
          console.error(e);
          alert('Error al eliminar el proveedor');
        }
      });
    }
  }

  changePage(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.getSuppliers();
  }


}

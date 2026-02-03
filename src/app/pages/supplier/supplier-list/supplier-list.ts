import { Component, inject, signal } from '@angular/core';
import { supplierService } from '../../../services/supplier';
import { SupplierDet } from '../../../models/supplier/supplier-det';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip'; 
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'; 
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-supplier-list',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatPaginatorModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatTooltipModule,
    RouterLink
  ],
  templateUrl: './supplier-list.html',
  styleUrl: './supplier-list.css',
})
export class SupplierList {
  private supplierService = inject(supplierService);
  private snackBar = inject(MatSnackBar); 

  totalElements = signal<number>(0);
  pageIndex = signal<number>(0);
  pageSize = signal<number>(10);
  readonly supplier = signal<SupplierDet[]>([]);
  private searchTimer : any;

  ngOnInit(){
    this.getSuppliers();
  }

  getSuppliers(){
    this.supplierService.getSuppliers(this.pageIndex(), this.pageSize()).subscribe({
      next : (data)=>{
        this.supplier.set(data.content);
        this.totalElements.set(data.page.totalElements);
      },
      error : (e)=> console.error(e)
    })
  }

  onSearch(input : string){
    if(this.searchTimer) clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(()=>{
      if(input.trim() === '') this.getSuppliers();
      else this.searchSupplier(input);
    }, 300);
  }

  searchSupplier(input: string){
    this.supplierService.searchSupplier(input).subscribe({
      next : (data) =>{
        this.supplier.set(data.content);
        this.totalElements.set(data.page ? data.page.totalElements : data.content.length);
      },
      error: (e)=> console.error(e)
    })
  }


  deleteSupplier(id: string): void {

    if (confirm('¿Estás seguro de que deseas eliminar este proveedor?')) {
      this.supplierService.deleteSupplier(id).subscribe({
        next: () => {
          this.showToast('Proveedor eliminado correctamente', 'success');
          this.supplier.update((list) => list.filter((s) => s.id !== id));
        },
        error: (e) => {
          console.error(e);
          this.showToast('Error al eliminar el proveedor', 'error');
        }
      });
    }
  }

  changePage(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.getSuppliers();
  }

  private showToast(message: string, type: 'success' | 'error' = 'success') {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: type === 'error' ? ['bg-red-500', 'text-white'] : ['bg-green-600', 'text-white']
    });
  }
}
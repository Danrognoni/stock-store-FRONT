import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { supplierService } from '../../../services/supplier';
import { SupplierDet } from '../../../models/supplier/supplier-det';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SupplierList } from '../supplier-list/supplier-list';

@Component({
  selector: 'app-supplier-detail',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatListModule, MatIconModule, MatDividerModule, RouterLink],
  templateUrl: './supplier-detail.html',
  styleUrl: './supplier-detail.css'
})
export class SupplierDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private supplierService = inject(supplierService);
    readonly supplierDelete = signal<SupplierDet[]>([]);

  supplier = signal<SupplierDet | null>(null);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.supplierService.getSupplier(id).subscribe({
        next: (data) => this.supplier.set(data),
        error: (error) => console.error(error)
      });
    }
  }

    deleteSupplier(id: string): void {

    if (confirm('¿Estás seguro de que deseas eliminar este proveedor?')) {
      this.supplierService.deleteSupplier(id).subscribe({
        next: () => {
          this.showToast('Proveedor eliminado correctamente', 'success');
          this.supplierDelete.update((list) => list.filter((s) => s.id !== id));
        },
        error: (e) => {
          console.error(e);
          this.showToast('Error al eliminar el proveedor', 'error');
        }
      });
    }
  }

   

    private snackBar = inject(MatSnackBar); 


  private showToast(message: string, type: 'success' | 'error' = 'success') {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: type === 'error' ? ['bg-red-500', 'text-white'] : ['bg-green-600', 'text-white']
    });
  }
}

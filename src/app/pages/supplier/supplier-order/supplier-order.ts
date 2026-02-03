import { Component, inject, OnInit, signal } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select'; // Importante para el desplegable
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { supplierService } from '../../../services/supplier';

@Component({
  selector: 'app-supplier-order',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatSelectModule, // Agregado
    MatSnackBarModule,
    RouterLink
  ],
  templateUrl: './supplier-order.html',
  styleUrl: './supplier-order.css'
})
export class SupplierOrderComponent implements OnInit {
  private fb = inject(FormBuilder);
  private supplierService = inject(supplierService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  orderForm: FormGroup;
  supplierId = signal<string>("");
  supplierName = signal<string>("");
  supplierProducts = signal<any[]>([]); // Lista de productos del proveedor
  isLoading = signal<boolean>(false);

  constructor() {
    this.orderForm = this.fb.group({
      items: this.fb.array([])
    });
  }

  get items(): FormArray {
    return this.orderForm.get('items') as FormArray;
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.supplierId.set(id);
      this.loadSupplierData(id);
    }
  }

  private loadSupplierData(id: string) {
    this.supplierService.getSupplier(id).subscribe({
      next: (data) => {
        this.supplierName.set(data.name);
        // Guardamos los productos que vende este proveedor para el select
        if (data.products) {
          this.supplierProducts.set(data.products);
        }
        
        // Agregamos una fila inicial
        this.addItem();
      },
      error: (e) => {
        console.error(e);
        this.showToast('Error al cargar datos del proveedor', 'error');
        this.router.navigate(['/suppliers']);
      }
    });
  }

  newItem(): FormGroup {
    return this.fb.group({
      // Ahora guardamos el ID del producto, no el nombre
      productId: ['', Validators.required], 
      quantity: [1, [Validators.required, Validators.min(1)]]
    });
  }

  addItem() {
    this.items.push(this.newItem());
  }

  removeItem(index: number) {
    this.items.removeAt(index);
  }

  onSubmit() {
    if (this.orderForm.invalid) {
      this.orderForm.markAllAsTouched();
      return;
    }

    const idNum = Number(this.supplierId());
    if (isNaN(idNum)) {
      this.showToast('ID de proveedor inválido', 'error');
      return;
    }

    this.isLoading.set(true);

    // Mapeamos para enviar el formato que probablemente espera tu backend
    // (Asumiendo que espera { productId: number, quantity: number }[])
    const orderItems = this.items.value.map((item: any) => ({
      productId: item.productId, // Enviamos el ID seleccionado
      quantity: item.quantity
    }));

    this.supplierService.sendOrderToSupplier(orderItems, idNum).subscribe({
      next: () => {
        this.showToast('Orden enviada correctamente', 'success');
        this.router.navigate(['/suppliers']);
      },
      error: (e) => {
        console.error(e);
        this.showToast('Error al procesar la orden', 'error');
        this.isLoading.set(false);
      }
    });
  }

  private showToast(message: string, type: 'success' | 'error') {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: type === 'error' ? ['error-snackbar'] : ['success-snackbar']
    });
  }
}
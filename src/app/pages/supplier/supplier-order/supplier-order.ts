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
import { SupplierOrder } from '../../../models/supplier/supplier-order';

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
        if (data.products) {
          this.supplierProducts.set(data.products);
        }
        
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

    // 1. Obtenemos el ID del proveedor tal cual viene de la ruta
    const idSupplier = this.supplierId(); 
    
    if (!idSupplier) {
      this.showToast('ID de proveedor no encontrado', 'error');
      return;
    }

    this.isLoading.set(true);

    // 2. Convertimos los productos a NÚMEROS explícitamente.
    // El backend (Java) espera un Long/Integer, si enviamos string falla la validación HV000030.
    const orderItems: SupplierOrder[] = this.items.value.map((item: any) => ({
      productId: Number(item.productId), 
      quantity: Number(item.quantity)
    }));

    console.log('Enviando orden:', orderItems); 

    // 3. Enviamos la orden
    // Nota: Aunque idSupplier sea string ("3"), la URL se construye bien.
    // Pasamos "any" en el segundo parametro si tu servicio pide number, o lo convertimos.
    const supplierIdParam = Number(idSupplier) || idSupplier; 

    this.supplierService.sendOrderToSupplier(orderItems, supplierIdParam as any).subscribe({
      next: () => {
        this.showToast('Orden enviada correctamente', 'success');
        this.router.navigate(['/suppliers']);
      },
      error: (e) => {
        console.error('Error detallado:', e);
        // Si sigue fallando, veremos el mensaje real del backend
        const msg = e.error?.message || 'Error al procesar la orden';
        this.showToast(msg, 'error');
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
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { supplierService } from '../../../services/supplier';
import { ProductService } from '../../../services/product';
import { Toast } from '../../category/category-form-component/category-form-component';

@Component({
  selector: 'app-supplier-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    RouterLink
  ],
  templateUrl: './supplier-form.html',
  styleUrl: './supplier-form.css'
})
export class SupplierForm implements OnInit {
  private fb = inject(FormBuilder);
  private supplierService = inject(supplierService);
  private productService = inject(ProductService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  
  notification = signal<Toast | null>(null);

  formGroup: FormGroup;
  supplierId = signal<string>("");
  isEditMode = signal<boolean>(false);
  products = signal<any[]>([]);
  isLoading = signal<boolean>(false);

  constructor() {
    this.formGroup = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9+ -]+$')]],
      productIds: [[]]
    });
  }

  ngOnInit(): void {
    this.loadProducts();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.supplierId.set(id);
      this.isEditMode.set(true);
      this.loadSupplier(id);
    }
  }

  private loadProducts() {
    this.productService.getProducts(0, 100).subscribe({
      next: (response) => {
        this.products.set(response.content || response);
      },
      error: (e) => {
        console.error('Error cargando productos:', e);
        this.showToast('No se pudieron cargar los productos', 'error');
      }
    });
  }

  private loadSupplier(id: string) {
    this.supplierService.getSupplier(id).subscribe({
      next: (data) => {
        const formData = {
          ...data,
          productIds: data.products ? data.products.map((p: any) => p.id) : []
        };
        this.formGroup.patchValue(formData);
      },
      error: (e) => {
        console.error(e);
        this.showToast('Error al cargar datos del proveedor', 'error');
        setTimeout(() => this.router.navigate(['/suppliers']), 1000);
      }
    });
  }

  onSubmit() {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    const request = this.formGroup.value;

    const action$ = this.isEditMode()
      ? this.supplierService.patchSupplier(this.supplierId(), request)
      : this.supplierService.postSupplier(request);

    action$.subscribe({
      next: () => {
        const msg = this.isEditMode() ? 'Proveedor actualizado correctamente' : 'Proveedor creado con éxito';
        this.showToast(msg, 'success');
        setTimeout(() => this.router.navigate(['/suppliers']), 1000);
      },
      error: (e) => {
        console.error(e);
        this.showToast('Ocurrió un error al guardar los cambios', 'error');
        this.isLoading.set(false);
      }
    });
  }

  private showToast(message: string, type: 'success' | 'error') {
    this.notification.set({ message, type });
    setTimeout(() => {
      this.notification.set(null);
    }, 3000);
  }
}
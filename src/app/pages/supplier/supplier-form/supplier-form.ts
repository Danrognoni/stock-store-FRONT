import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { supplierService } from '../../../services/supplier';
import { ProductService } from '../../../services/product';

@Component({
  selector: 'app-supplier-form',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, RouterLink, MatSelectModule],
  templateUrl: './supplier-form.html',
  styleUrl: './supplier-form.css'
})
export class SupplierForm implements OnInit {
  private fb = inject(FormBuilder);
  private supplierService = inject(supplierService);
  private productService = inject(ProductService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  formGroup: FormGroup;
  supplierId = signal<string>("");
  isEditMode = signal<boolean>(false);

  products = signal<any[]>([]);

  constructor() {
    this.formGroup = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      productIds: [[]]
    });
  }

  ngOnInit(): void {
    this.productService.getProducts(0, 100).subscribe({
      next: (response) => {
        this.products.set(response.content || response);
      },
      error: (e) => console.error('Error cargando productos:', e)
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.supplierId.set(id);
      this.isEditMode.set(true);
      this.supplierService.getSupplier(id).subscribe({
        next: (data) => {
           const formData = {
             ...data,
             productIds: data.products ? data.products.map((p: any) => p.id) : []
           };
          this.formGroup.patchValue(formData);
        },
        error: (e) => console.error(e)
      });
    }
  }

  onSubmit() {
    if (this.formGroup.invalid) return;

    const request = this.formGroup.value;

    if (this.isEditMode()) {
      this.supplierService.patchSupplier(this.supplierId(), request).subscribe({
        next: () => {
          alert('Proveedor actualizado correctamente');
          this.router.navigate(['/suppliers']);
        },
        error: (e) => console.error(e)
      });
    } else {
      this.supplierService.postSupplier(request).subscribe({
        next: () => {
          alert('Proveedor creado con éxito');
          this.router.navigate(['/suppliers']);
        },
        error: (e) => console.error(e)
      });
    }
  }
}

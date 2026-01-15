import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { supplierService } from '../../../services/supplier';

@Component({
  selector: 'app-supplier-form',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, RouterLink],
  templateUrl: './supplier-form.html',
  styleUrl: './supplier-form.css'
})
export class SupplierForm implements OnInit {
  private fb = inject(FormBuilder);
  private supplierService = inject(supplierService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  formGroup: FormGroup;
  supplierId = signal<string>("");
  isEditMode = signal<boolean>(false);

  constructor() {
    this.formGroup = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      productsId: [[]]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.supplierId.set(id);
      this.isEditMode.set(true);
      this.supplierService.getSupplier(id).subscribe({
        next: (data) => {

           const formData = {
             ...data,
             productsId: data.products ? data.products.map((p: any) => p.id) : []
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

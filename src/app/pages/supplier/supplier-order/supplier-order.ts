import { Component, inject, OnInit, signal } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { supplierService } from '../../../services/supplier';
import { SupplierDet } from '../../../models/supplier/supplier-det';

@Component({
  selector: 'app-supplier-order',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatCardModule, RouterLink],
  templateUrl: './supplier-order.html',
  styleUrl: './supplier-order.css'
})
export class SupplierOrderComponent implements OnInit {
  private fb = inject(FormBuilder);
  private supplierService = inject(supplierService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  orderForm: FormGroup;
  supplierId = signal<string>("");
  supplierName = signal<string>("");

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

      this.supplierService.getSupplier(id).subscribe(data => {
        this.supplierName.set(data.name);
      });

      this.addItem();
    }
  }

  newItem(): FormGroup {
    return this.fb.group({
      productName: ['', Validators.required],
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
    if (this.orderForm.invalid) return;
    const idNum = Number(this.supplierId());

    if (isNaN(idNum)) {
      console.error("El ID del proveedor no es numérico, revisa la compatibilidad");
    }

    this.supplierService.sendOrderToSupplier(this.items.value, idNum).subscribe({
      next: () => {
        alert('Orden enviada correctamente');
        this.router.navigate(['/suppliers']);
      },
      error: (e) => {
        console.error(e);
        alert('Error al enviar la orden');
      }
    });
  }
}

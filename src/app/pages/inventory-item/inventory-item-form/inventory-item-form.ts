import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { inventoryItemService } from '../../../services/inventory-item';
import { ProductService } from '../../../services/product';
import { ProductDet } from '../../../models/product/product-det';
import { InventoryItemRequest } from '../../../models/inventoryItem/inventory-item-request';

@Component({
  selector: 'app-inventory-item-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    RouterLink
  ],
  templateUrl: './inventory-item-form.html',
  styleUrl: './inventory-item-form.css',
})
export class InventoryItemForm implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private inventoryService = inject(inventoryItemService);
  private productService = inject(ProductService);

  form: FormGroup = this.fb.group({
    productId: ['', [Validators.required]],
    stock: [0, [Validators.required, Validators.min(0)]],
    expireDate: [null, [Validators.required]]
  });

  isEditMode = signal<boolean>(false);
  itemId = signal<string | null>(null);
  products = signal<ProductDet[]>([]);

  ngOnInit(): void {
    this.loadProducts();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.itemId.set(id);
      this.loadItemData(id);
    }
  }

  loadProducts() {
    this.productService.getProducts(0, 1000).subscribe({
      next: (data: any) => {
        this.products.set(data.content || []);
      },
      error: (err) => console.error('Error cargando productos', err)
    });
  }

  loadItemData(id: string) {
    this.inventoryService.getInventoryItem(id).subscribe({
      next: (item: any) => {
        this.form.patchValue({
          productId: item.product?.id,
          stock: item.stock,
          expireDate: item.expireDate
        });
      },
      error: (err) => console.error('Error cargando item', err)
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    const request: InventoryItemRequest = {
      productId: this.form.get('productId')?.value,
      stock: this.form.get('stock')?.value,
      expireDate: this.form.get('expireDate')?.value
    };

    const operation = (this.isEditMode() && this.itemId())
      ? this.inventoryService.patchInventoryItem(this.itemId()!, request)
      : this.inventoryService.postInventoryItem(request);

    operation.subscribe({
      next: () => this.router.navigate(['/inventory']),
      error: (err) => {
        console.error('Error guardando item', err);
        alert('Error al guardar el item');
      }
    });
  }
}

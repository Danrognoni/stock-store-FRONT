import { Component, inject, OnInit, signal, Injectable } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS, NativeDateAdapter } from '@angular/material/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { inventoryItemService } from '../../../services/inventory-item';
import { ProductService } from '../../../services/product';
import { ProductDet } from '../../../models/product/product-det';
import { InventoryItemRequest } from '../../../models/inventoryItem/inventory-item-request';

@Injectable()
class CustomDateAdapter extends NativeDateAdapter {
  override parse(value: any): Date | null {
    if ((typeof value === 'string') && (value.indexOf('/') > -1)) {
      const str = value.split('/');
      const day = Number(str[0]);
      const month = Number(str[1]) - 1;
      const year = Number(str[2]);
      return new Date(year, month, day);
    }
    const timestamp = typeof value === 'number' ? value : Date.parse(value);
    return isNaN(timestamp) ? null : new Date(timestamp);
  }

  override format(date: Date, displayFormat: Object): string {
    if (displayFormat === 'input') {
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    }
    return super.format(date, displayFormat);
  }
}

const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'input',
  },
  display: {
    dateInput: 'input',
    monthYearLabel: { year: 'numeric', month: 'short' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'long' },
  },
};

@Component({
  selector: 'app-inventory-item-form',
  standalone: true,
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
    { provide: DateAdapter, useClass: CustomDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ],
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

  minDate = new Date(new Date().setDate(new Date().getDate() + 1));

  form: FormGroup = this.fb.group({
    productId: ['', [Validators.required]],
    stock: [null, [Validators.required, Validators.min(1), Validators.pattern("^[0-9]*$")]],
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

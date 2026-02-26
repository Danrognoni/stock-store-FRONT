import { Component, inject, OnInit, signal } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { ProductService } from '../../../services/product';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { CategoryService } from '../../../services/category';
import { MatCardModule } from '@angular/material/card';
import { MatDivider } from "@angular/material/divider";
import { ProductRequest } from '../../../models/product/product-request';
import { ProductDet } from '../../../models/product/product-det';
import { Toast } from '../../category/category-form-component/category-form-component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-product-form',
  standalone: true,
  styleUrl: './product-form.css',
  templateUrl: './product-form.html',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatCardModule,
    MatDivider,
    RouterLink, 
    MatIconModule
  ],
})
export class ProductForm implements OnInit {
  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  formGroup: FormGroup;
  productId = signal<string>("");
  categories = signal<any[]>([]);
  notification = signal<Toast | null>(null);

  constructor() {
    this.formGroup = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      imageUrl: ['', [Validators.required, Validators.pattern('https?://.+')]],
      price: ['', [Validators.required, Validators.min(0.01)]],
      barcode: ['', [Validators.pattern('^[0-9]*$')]],
      categoriesId: [[], [Validators.required]],
    });
  }

  ngOnInit(): void {
  this.getCategories();
  const id = this.route.snapshot.paramMap.get("id");
  if (id) {
    this.productId.set(id);
    this.productService.getProduct(id).subscribe({
      next: (data: ProductDet) => {
        this.formGroup.patchValue({
          name: data.name,
          imageUrl: data.imageUrl,
          price: data.price,
          categoriesId: data.categories.map(cat => cat.id)
        });
      },
      error: (error) => console.error(error)
    });
  }
}

onSubmit() {
  this.formGroup.markAllAsTouched();
  if (this.formGroup.invalid) return;

  const formValue = this.formGroup.value;

  const payload: ProductRequest = {
    name: formValue.name,
    imageUrl: formValue.imageUrl,
    price: formValue.price,
    categoriesId: formValue.categoriesId,
    barcode: formValue.barcode && formValue.barcode.trim() !== '' ? formValue.barcode : null
  };

  console.log('Enviando:', payload);

  if (this.productId().trim() !== "") {
    this.productService.patchProduct(this.productId(), payload).subscribe({
      next: () => {
        this.showToast("Producto editado correctamente", "success");
        setTimeout(() => this.router.navigate(["/products/list"]), 1000);
      },
      error: (error) => {
        console.error(error);
        this.showToast("Error al editar: " + (error.error?.message || "Ver consola"), "error");
      }
    });
  } else {
    this.productService.postProduct(payload).subscribe({
      next: () => {
        this.showToast('Producto creado con éxito', "success");
        setTimeout(() => this.router.navigate(['/products/list']), 1000);
      },
      error: (error) => {
        console.error(error);
        if (error.error?.message?.includes("Duplicate entry")) {
          this.showToast("Error: Ya existe un producto con ese Código de Barras o Nombre.", "error");
        } else {
          this.showToast("Error al crear el producto. Revisa los datos.", "error");
        }
      },
    });
  }
}

  getCategories() {
    this.categoryService.getCategories(0, 5000).subscribe({
      next: (data: any) => {
        this.categories.set(data.content);
      },
      error: (error: any) => {
        console.error(error);
      },
    });
  }

  private showToast(message: string, type: 'success' | 'error') {
    this.notification.set({ message, type });
    setTimeout(() => {
      this.notification.set(null);
    }, 3000);
  }

  get name() { return this.formGroup.get('name'); }
  get imageUrl() { return this.formGroup.get('imageUrl'); }
  get price() { return this.formGroup.get('price'); }
  get barcode() { return this.formGroup.get('barcode'); }
  get categoriesId() { return this.formGroup.get('categoriesId'); }

}

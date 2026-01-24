import {Component, inject, OnInit, signal} from '@angular/core';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { ProductService } from '../../../services/product';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { CategoryService } from '../../../services/category';


@Component({
  selector: 'app-product-form',
  styleUrl: './product-form.css',
  templateUrl: './product-form.html',
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, ReactiveFormsModule, MatSelectModule],
})
export class ProductForm implements OnInit{
  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  formGroup: FormGroup;
  productId = signal<string>("");
  categories = signal<any[]>([]);

  constructor() {
    this.formGroup = this.fb.group({
      name: ['', Validators.required],
      imageUrl: ['', Validators.required],
      price: ['', Validators.required],
      barcode: [''],
      categoriesId: [[], Validators.required],
    });
  }

  ngOnInit(): void {
   this.getCategories();
   const id = this.route.snapshot.paramMap.get("id");
   if(id){
    this.productId.set(id);
    this.productService.getProduct(id).subscribe({
      next:(data)=>{
        this.formGroup.patchValue(data);
      },
      error:(error)=>{
        console.log(error);

      }
    });
   }
  }

  getCategories() {
    this.categoryService.getCategories(0, 5000).subscribe({
      next: (data: any) => {
        this.categories.set(data.content);
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }

  get name() {
    return this.formGroup.get('name');
  }

  get imageUrl() {
    return this.formGroup.get('imageUrl');
  }

  onSubmit() {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.invalid) {
      return;
    }
    if(this.productId().trim() !== ""){
      this.productService.patchProduct(this.productId(), this.formGroup.value).subscribe({
        next:()=>{
          alert("Producto editado correctamente");
          this.router.navigate(["/products"]);
        },
        error:(error)=>{
          console.log(error);
        }
      })
    }
    else{
      this.postProduct();
    }
  }

  postProduct() {
    this.productService.postProduct(this.formGroup.value).subscribe({
      next: () => {
        alert('Producto creado con exito');
        this.router.navigate(['/products']);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
}

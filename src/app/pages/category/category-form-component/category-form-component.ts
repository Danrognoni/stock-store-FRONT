import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CategoryService } from '../../../services/category';

interface Toast {
  message: string;
  type: 'success' | 'error';
}

@Component({
  selector: 'app-category-form-component',
  imports: [
    ReactiveFormsModule, 
    MatInputModule, 
    MatButtonModule, 
    MatFormFieldModule, 
    MatCardModule, 
    MatDividerModule, 
    RouterLink
  ],
  templateUrl: './category-form-component.html',
  styleUrl: './category-form-component.css',
})
export class CategoryFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private categoryService = inject(CategoryService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  formGroup: FormGroup;
  isEditMode = signal<boolean>(false);
  categoryId: string | null = null;
  
  notification = signal<Toast | null>(null);

  constructor() {
    this.formGroup = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.pattern('^[a-zA-Z0-9 áéíóúÁÉÍÓÚñÑ]*$')]]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode.set(true);
        this.categoryId = id;
        this.loadCategory(id);
      }
    });
  }

  get name() {
    return this.formGroup.get('name');
  }

  loadCategory(id: string) {
    this.categoryService.getCategory(id).subscribe({
      next: (data) => {
        this.formGroup.patchValue({ name: data.name });
      },
      error: (e) => this.showToast('Error cargando categoría', 'error')
    });
  }

  onSubmit() {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.invalid) return;

    const request = this.formGroup.value;

    if (this.isEditMode() && this.categoryId) {
      this.categoryService.patchCategory(this.categoryId, request).subscribe({
        next: () => {
          this.showToast('Categoría actualizada con éxito', 'success');
          setTimeout(() => this.router.navigate(['/products/category/list']), 1500);
        },
        error: (e) => {
          console.error(e);
          this.showToast('Error al actualizar', 'error');
        }
      });
    } else {
      this.categoryService.postCategory(request).subscribe({
        next: () => {
          this.showToast('Categoría creada con éxito', 'success');
          setTimeout(() => this.router.navigate(['/products/category/list']), 1500);
        },
        error: (e) => {
          console.error(e);
          this.showToast('Error al crear', 'error');
        }
      });
    }
  }

  private showToast(message: string, type: 'success' | 'error') {
    this.notification.set({ message, type });
    setTimeout(() => {
      this.notification.set(null);
    }, 3000);
  }
}
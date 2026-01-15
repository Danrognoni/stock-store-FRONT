import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CategoryService } from '../../../services/category';

@Component({
  selector: 'app-category-form-component',
  imports: [ReactiveFormsModule, MatInputModule, MatButtonModule, MatFormFieldModule, RouterLink],
  templateUrl: './category-form-component.html',
  styleUrl: './category-form-component.css',
})
export class CategoryFormComponent {
  private fb = inject(FormBuilder);
  private categoryService = inject(CategoryService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  formGroup: FormGroup;
  isEditMode = signal<boolean>(false);
  categoryId: string | null = null;

  constructor() {
    this.formGroup = this.fb.group({
      name: ['', Validators.required]
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

  loadCategory(id: string) {
    this.categoryService.getCategory(id).subscribe({
      next: (data) => {
        this.formGroup.patchValue({
          name: data.name
        });
      },
      error: (e) => console.error('Error cargando categoría', e)
    });
  }

  onSubmit() {
    if (this.formGroup.invalid) return;

    const request = this.formGroup.value;

    if (this.isEditMode() && this.categoryId) {
      this.categoryService.patchCategory(this.categoryId, request).subscribe({
        next: () => {
          alert('Categoría actualizada');
          this.router.navigate(['/categories']);
        },
        error: (e) => console.error(e)
      });
    } else {
      this.categoryService.postCategory(request).subscribe({
        next: () => {
          alert('Categoría creada');
          this.router.navigate(['/categories']);
        },
        error: (e) => console.error(e)
      });
    }
  }
}

import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { CategoryService } from '../../../services/category';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-category-list-component',
  imports: [MatCardModule, MatButtonModule, MatPaginatorModule, MatIconModule, RouterLink],
  templateUrl: './category-list-component.html',
  styleUrl: './category-list-component.css',
})
export class CategoryListComponent {
  private categoryService = inject(CategoryService);

  totalElements = signal<number>(0);
  pageIndex = signal<number>(0);
  pageSize = signal<number>(10);

  readonly categories = signal<any[]>([]);
  private searchTimer: any;

  ngOnInit() {
    this.getCategories();
  }

  getCategories() {
    this.categoryService.getCategories(this.pageIndex(), this.pageSize()).subscribe({
      next: (data) => {
        this.categories.set(data.content);
        this.totalElements.set(data.page.totalElements);
      },
      error: (e) => console.error(e)
    });
  }

  onSearch(input: string) {
    if(this.searchTimer){
      clearTimeout(this.searchTimer);
    }
    this.searchTimer = setTimeout(() => {
      if (input.trim() === '') {
        this.getCategories();
      } else {
        this.searchCategory(input);
      }
    }, 300);
  }

  searchCategory(name: string) {
    this.categoryService.searchCategory(name).subscribe({
      next: (data) => {
        const content = data.content ? data.content : (Array.isArray(data) ? data : [data]);
        this.categories.set(content);
        this.totalElements.set(content.length);
      },
      error: (e) => console.error(e)
    });
  }

  deleteCategory(id: string): void {
    if (confirm('¿Eliminar esta categoría?')) {
      this.categoryService.deleteCategory(id).subscribe({
        next: () => {
          alert('Categoría eliminada con éxito');
          this.getCategories();
        },
        error: (e) => {
          console.error(e);
          alert('Error al eliminar');
        }
      });
    }
  }

  changePage(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.getCategories();
  }
}

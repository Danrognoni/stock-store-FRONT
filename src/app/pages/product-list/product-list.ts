import {ChangeDetectionStrategy, Component, inject, OnInit, signal} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { PageEvent } from '@angular/material/paginator';
import { ProductService } from '../../services/product';
import { ProductDet } from '../../models/product/product-det';
import { CategoryDet } from '../../models/category/category-det';

/**
 * @title Card overview
 */
@Component({
  selector: 'product-list',
  templateUrl: 'product-list.html',
  styleUrl: 'product-list.css',
  imports: [MatCardModule, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductList implements OnInit{
  totalElements = signal<number>(0);
  pageIndex = signal<number>(0);
  pageSize = signal<number>(18);

  productService = inject(ProductService);
  products = signal<ProductDet[]>([]);
  private searchTimer: any;

    categoryService = inject(CategoryService);
    category = signal<CategoryDet[]>([]);


  ngOnInit(): void {
    this.getProducts();
  }

  getProducts() {
    this.productService.getProducts(this.pageIndex(), this.pageSize()).subscribe({
      next: (data) => {
        this.products.set(data.content);
        this.totalElements.set(data.page.totalElements);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  onSearch(input: string) {
    if (this.searchTimer) {
      clearTimeout(this.searchTimer);
    }
    this.searchTimer = setTimeout(() => {
      if (input.trim() === '') {
        this.getProducts();
      } else {
        this.pageIndex.set(0);
        this.searchProducts(input);
      }
    }, 300);
  }

  searchProducts(input: string) {
    this.productService.searchProduct(input).subscribe({
      next: (data) => {
        this.products.set(data.content);
        if(data.page){
          this.totalElements.set(data.page.totalElements);
        }
        else{
          this.totalElements.set(data.content.length);
        }
      },
      error: (error) => console.log(error),
    });
  }

  deleteProduct(id: string) {
    if (confirm('Eliminar este producto?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          alert('Producto eliminado con exito');
          this.products.update((products) => products.filter((p) => p.id !== id));
        },
        error: (error) => {
          alert('Error al eliminar el producto');
        },
      });
    }
  }

  changePage(event: PageEvent) {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.getProducts();
  }



  getCategories() {
    return this.categoryService.getCategories(this.pageIndex(), this.pageSize()).subscribe({
      next: (data) => {
        this.category.set(data);
        this.totalElements.set(data.page.totalElements);
      },
      error: (e) => {
        console.error(e);

      }
    })
  }

  onSearch(input: string) {
    if (this.searchTimer) {
      clearTimeout(this.searchTimer);
    }
    this.searchTimer = setTimeout(() => {
      if (input.trim() === '') {
        this.getCategories();
      } else {
        this.pageIndex.set(0);
        this.searchCategory(input);
      }
    }, 300)
  }

  searchCategory(input: string) {
    this.categoryService.searchCategory(input).subscribe({
      next: (data) => {
        this.category.set(data.content);
        if (data.page) {
          this.totalElements.set(data.page.totalElements);
        }
        else {
          this.totalElements.set(data.content.length);
        }
      },
      error: (error) => console.log(error),
    });
  }

}

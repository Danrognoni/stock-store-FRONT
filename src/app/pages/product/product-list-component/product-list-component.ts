import {ChangeDetectionStrategy, Component, inject, OnInit, signal} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { ProductService } from '../../../services/product';
import { ProductDet } from '../../../models/product/product-det';
import { MatDividerModule } from '@angular/material/divider';
import { RouterLink } from '@angular/router';
import { Toast } from '../../category/category-form-component/category-form-component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-component.html',
  styleUrl: './product-list-component.css',
  imports: [MatCardModule, MatButtonModule, MatPaginatorModule, MatDividerModule, RouterLink, MatIconModule],
})
export class ProductListComponent implements OnInit{
  totalElements = signal<number>(0);
  pageIndex = signal<number>(0);
  pageSize = signal<number>(18);

  productService = inject(ProductService);
  products = signal<ProductDet[]>([]);
  private searchTimer: any;
  notification = signal<Toast | null>(null);
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
          this.showToast('Producto eliminado con exito', 'success');
          this.products.update((products) => products.filter((p) => p.id !== id));
        },
        error: (error) => {
          this.showToast('Error al eliminar el producto', 'error');
        },
      });
    }
  }

  changePage(event: PageEvent) {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.getProducts();
  }

  private showToast(message: string, type: 'success' | 'error') {
    this.notification.set({ message, type });
    setTimeout(() => {
      this.notification.set(null);
    }, 3000);
  }

}

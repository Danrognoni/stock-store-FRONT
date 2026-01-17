import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

import { ProductDet } from '../../models/product/product-det';
import { ProductService } from '../../services/product';
import { CartService } from '../../services/cart-service';

@Component({
  selector: 'app-online-store-layout',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatBadgeModule, MatSnackBarModule, MatPaginatorModule],
  templateUrl: './online-store-layout.html',
  styleUrl: './online-store-layout.css'
})
export class OnlineStoreLayout implements OnInit {

  products = signal<ProductDet[]>([]);

  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private snackBar = inject(MatSnackBar);

  totalElements = signal<number>(0);
  pageIndex = signal<number>(0);
  pageSize = signal<number>(12);
  pageSizeOptions = [12, 24, 48];

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getProducts(this.pageIndex(), this.pageSize()).subscribe({
      next: (data: any) => {
        this.products.set(data.content);
        this.totalElements.set(data.totalElements);
      },
      error: (err) => console.error('Error cargando productos:', err)
    });
  }

  onPageChange(event: PageEvent) {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.loadProducts();
  }

  addToCart(product: ProductDet) {
    const productId = String(product.id);
    this.cartService.addToCart(productId, 1).subscribe({
      next: () => {
        this.snackBar.open(`${product.name} agregado al carrito`, 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('Error al agregar (¿Estás logueado?)', 'Cerrar', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }
}


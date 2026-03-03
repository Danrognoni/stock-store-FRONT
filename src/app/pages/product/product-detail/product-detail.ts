import { Component, inject, Input, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ProductService } from '../../../services/product';
import { AuthenticationService } from '../../../services/authentication-service';
import { CartService } from '../../../services/cart-service';
import { ProductDet } from '../../../models/product/product-det';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css'
})
export class ProductDetail implements OnInit {

  private productService = inject(ProductService);
  private authService = inject(AuthenticationService);
  private cartService = inject(CartService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  @Input() id?: string;

  product = signal<ProductDet | null>(null);
  loading = signal<boolean>(true);

  isAdminOrEmployee = computed(() => {
    const user = this.authService.currentUser();
    return user?.role === 'ADMIN' || user?.role === 'EMPLOYEE';
  });

  ngOnInit() {
    if (this.id) {
      this.loadProduct(this.id);
    }
  }

  loadProduct(id: string) {
    this.loading.set(true);
    this.productService.getProduct(id).subscribe({
      next: (data) => {
        this.product.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  addToCart() {
    const p = this.product();
    if (p) {
      if (this.isInCart()) return;
      this.cartService.addItemToCart(p.id, 1).subscribe({
        next: () => {
          this.snackBar.open('Producto agregado al carrito', 'Cerrar', { duration: 3000 });
        },
        error: (err) => {
          console.error(err);
          this.snackBar.open('Error al agregar al carrito', 'Cerrar');
        }
      });
    }
  }

  isInCart(): boolean {
    const p = this.product();
    if (!p) return false;
    return this.cartService.cartProductIds().has(p.id.toString());
  }

  getBack() {
    window.history.back();
  }
}
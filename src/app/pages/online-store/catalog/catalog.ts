import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ProductService } from '../../../services/product';
import { CartService } from '../../../services/cart-service';
import { NavbarComponent } from '../../../components/navbar/navbar-component/navbar-component';
import { WishlistService } from '../../../services/wishlist';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-store-catalog',
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatButtonModule, MatIconModule, NavbarComponent, RouterOutlet],
  templateUrl: './catalog.html',
  styleUrls: ['./catalog.css']
})
export class StoreCatalogComponent implements OnInit {
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private wishlistService = inject(WishlistService);
  products = signal<any[]>([]);
  private snackBar = inject(MatSnackBar);

  cartProductIds = signal<Set<number>>(new Set());
  wishlistProductIds = signal<Set<number>>(new Set());

  ngOnInit() {
    this.loadProducts();
    this.loadUserContext();
  }

  loadProducts() {
    this.productService.getProductsWithStock(0, 50).subscribe({
      next: (data: any) => {
        this.products.set(data.content);
      },
      error: (err) => console.error('Error cargando catálogo', err)
    });
  }

  loadUserContext() {
    this.cartService.getCart().subscribe({
      next: (cartItems: any[]) => {
  
        const ids = cartItems.map(item => item.product.id);
        this.cartProductIds.set(new Set(ids));
      },
      error: () => console.log('Usuario no logueado o error en carrito')
    });

    this.wishlistService.getWishlist().subscribe({
      next: (wishlistItems: any[]) => {
        const ids = wishlistItems.map(item => item.id);
        this.wishlistProductIds.set(new Set(ids));
      }
    });
  }

  addToCart(product: any) {
    if (this.cartProductIds().has(product.id)) return;

    this.cartService.addItemToCart(product.id, 1).subscribe({
      next: () => {
        this.snackBar.open('Agregado al carrito', 'Ok', { duration: 2000 });

        this.cartProductIds.update(ids => {
          const newSet = new Set(ids);
          newSet.add(product.id);
          return newSet;
        });
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('Error al agregar', 'Cerrar');
      }
    });
  }

  addToWishlist(product: any) {
    if (this.wishlistProductIds().has(product.id)) return;

    this.wishlistService.addToWishlist(product.id).subscribe({
      next: () => {
        this.snackBar.open(`¡${product.name} a favoritos!`, 'Genial', { duration: 2000 });

        this.wishlistProductIds.update(ids => {
          const newSet = new Set(ids);
          newSet.add(product.id);
          return newSet;
        });
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('Error al agregar', 'Cerrar');
      }
    });
  }

  isInCart(productId: number): boolean {
    return this.cartProductIds().has(productId);
  }

  isInWishlist(productId: number): boolean {
    return this.wishlistProductIds().has(productId);
  }
}
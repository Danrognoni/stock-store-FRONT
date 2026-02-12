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

  cartProductIds = signal<Set<string>>(new Set());
  wishlistProductIds = signal<Set<string>>(new Set());

  ngOnInit() {
    this.loadProducts();
    this.loadUserContext();
  }

  loadProducts() {
    this.productService.getProductsWithStock(0, 600).subscribe({
      next: (data: any) => {
        this.products.set(data.content);
      },
      error: (err) => console.error('Error cargando catálogo', err)
    });
  }

  loadUserContext() {
    this.cartService.getCart().subscribe({
      next: (cartData: any) => {
        const items = cartData.items || [];
        const ids = items.map((item: any) => item.product.id.toString());
        this.cartProductIds.set(new Set(ids));
      },
      error: () => console.log('Info: Usuario sin carrito activo')
    });

    this.wishlistService.getWishlist().subscribe({
      next: (wishlistData: any) => {
        const products = wishlistData?.products || [];
        const ids = products.map((product: any) => product.id.toString());
        this.wishlistProductIds.set(new Set(ids));
      },
      error: (err) => console.log('Error cargando wishlist', err)
    });
  }

  addToCart(product: any) {
     if (this.isInCart(product.id)) return;
     this.cartService.addItemToCart(product.id, 1).subscribe({
       next: () => {
         this.snackBar.open('Agregado al carrito', 'Ok', { duration: 2000 });
         this.cartProductIds.update(ids => {
           const newSet = new Set(ids);
           newSet.add(product.id.toString());
           return newSet;
         });
       },
       error: (err) => this.snackBar.open('Error al agregar', 'Cerrar')
     });
  }

  addToWishlist(product: any) {
    const productIdStr = product.id.toString();

    if (this.isInWishlist(product.id)) {
      this.wishlistService.removeFromWishlist(productIdStr).subscribe({
        next: () => {
          this.snackBar.open('Eliminado de favoritos', 'Ok', { duration: 2000 });
          this.wishlistProductIds.update(ids => {
            const newSet = new Set(ids);
            newSet.delete(productIdStr);
            return newSet;
          });
        },
        error: (err) => console.error('Error al quitar like', err)
      });
    } else {
      this.wishlistService.addToWishlist(productIdStr).subscribe({
        next: () => {
          this.snackBar.open('¡Añadido a favoritos!', 'Genial', { duration: 2000 });
          this.wishlistProductIds.update(ids => {
            const newSet = new Set(ids);
            newSet.add(productIdStr);
            return newSet;
          });
        },
        error: (err) => console.error('Error al dar like', err)
      });
    }
  }

  isInCart(productId: number): boolean {
    return this.cartProductIds().has(productId.toString());
  }

  isInWishlist(productId: number): boolean {
    return this.wishlistProductIds().has(productId.toString());
  }
}

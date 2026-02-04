import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { WishlistService } from '../../../services/wishlist';
import { CartService } from '../../../services/cart-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductList } from '../../../models/product/product-list';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, RouterLink],
  templateUrl: './wishlist.html',
  styleUrls: ['./wishlist.css'] 
})
export class WishlistComponent implements OnInit {
  private wishlistService = inject(WishlistService);
  private cartService = inject(CartService);
  private snackBar = inject(MatSnackBar);

  products = signal<ProductList[]>([]);
  isLoading = signal<boolean>(true);

  ngOnInit() {
    this.loadWishlist();
  }

  loadWishlist() {
    this.wishlistService.getWishlist().subscribe({
      next: (data) => {

        this.products.set(data.products || []); 
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.isLoading.set(false);
      }
    });
  }

  removeFromWishlist(productId: string) {
    this.wishlistService.removeFromWishlist(productId).subscribe({
      next: () => {
        this.products.update(list => list.filter(p => p.id !== productId));
        this.snackBar.open('Producto eliminado de favoritos', 'Ok', { duration: 2000 });
      },
      error: (err) => console.error(err)
    });
  }

  moveToCart(product: any) {
    this.cartService.addItemToCart(product.id, 1).subscribe({
      next: () => {
        this.snackBar.open('¡Movido al carrito!', 'Ok', { duration: 2000 });
      
      },
      error: () => this.snackBar.open('Error al agregar al carrito', 'Cerrar')
    });
  }
}
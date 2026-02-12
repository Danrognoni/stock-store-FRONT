import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { ProductService } from '../../../services/product';
import { CartService } from '../../../services/cart-service';
import { NavbarComponent } from '../../../components/navbar/navbar-component/navbar-component';
import { WishlistService } from '../../../services/wishlist';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CategoryService } from '../../../services/category';

@Component({
  selector: 'app-store-catalog',
  standalone: true,
  imports: [
    CommonModule, 
    RouterLink, 
    MatCardModule, 
    MatButtonModule, 
    MatIconModule, 
    MatChipsModule,
    NavbarComponent, 
    RouterOutlet
  ],
  templateUrl: './catalog.html',
  styleUrls: ['./catalog.css']
})
export class StoreCatalogComponent implements OnInit {
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private wishlistService = inject(WishlistService);
  private categoryService = inject(CategoryService);
  private snackBar = inject(MatSnackBar);

  products = signal<any[]>([]);
  categories = signal<any[]>([]);
  selectedCategoryId = signal<number | null>(null);

  cartProductIds = signal<Set<number>>(new Set());
  wishlistProductIds = signal<Set<number>>(new Set());

  ngOnInit() {
    this.loadCategories();
    this.loadProducts();
    this.loadUserContext();
  }

  loadCategories() {
    this.categoryService.getCategories(0, 100).subscribe({
      next: (data: any) => {
        this.categories.set(data.content);
      },
      error: (err) => console.error(err)
    });
  }

  loadProducts(categoryId?: number | null) {
    const idToFilter = categoryId === null ? undefined : categoryId;

    this.productService.getProductsWithStock(0, 600, idToFilter).subscribe({
      next: (data: any) => {
        this.products.set(data.content);
      },
      error: (err) => console.error(err)
    });
  }

  filterByCategory(categoryId: number | null) {
    this.selectedCategoryId.set(categoryId);
    this.loadProducts(categoryId);
  }

  loadUserContext() {
    this.cartService.getCart().subscribe({
      next: (cartItems: any[]) => {
        const ids = cartItems.map(item => item.product.id);
        this.cartProductIds.set(new Set(ids));
      },
      error: () => {}
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
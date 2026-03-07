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
import { MatDividerModule } from '@angular/material/divider';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { AuthenticationService } from '../../../services/authentication-service';

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
    RouterOutlet,
    MatDividerModule,
    MatPaginatorModule
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
  private authService = inject(AuthenticationService);
  isAdmin = signal<boolean>(false);
  products = signal<any[]>([]);
  categories = signal<any[]>([]);
  selectedCategoryId = signal<number | null>(null);

  totalElements = signal<number>(0);
  pageSize = signal<number>(10);
  pageIndex = signal<number>(0);

  wishlistProductIds = signal<Set<string>>(new Set());

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

    this.productService.getProductsWithStock(this.pageIndex(), this.pageSize(), idToFilter).subscribe({
      next: (data: any) => {
        this.products.set(data.content);
        this.totalElements.set(data.totalElements);
      },
      error: (err) => console.error(err)
    });
  }

  filterByCategory(categoryId: number | null) {
    this.selectedCategoryId.set(categoryId);
    this.pageIndex.set(0); // Reset to first page
    this.loadProducts(categoryId);
  }

  onPageChange(event: PageEvent) {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.loadProducts(this.selectedCategoryId());
  }

  loadUserContext() {
    const userRole = this.authService.currentUser()?.role;
    if (userRole && userRole !== 'USER') {
      this.isAdmin.set(true);
    }

    if (userRole === 'USER') {
      this.wishlistService.getWishlist().subscribe({
        next: (wishlistData: any) => {
          const products = wishlistData?.products || [];
          const ids = products.map((product: any) => product.id.toString());
          this.wishlistProductIds.set(new Set(ids));
        },
        error: (err) => console.log('Error cargando wishlist', err)
      });
    }
  }

  addToCart(product: any) {
    if (this.isInCart(product.id)) return;
    this.cartService.addItemToCart(product.id, 1).subscribe({
      next: () => {
        this.snackBar.open('Agregado al carrito', 'Ok', { duration: 2000 });
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
    return this.cartService.cartProductIds().has(productId.toString());
  }

  isInWishlist(productId: number): boolean {
    return this.wishlistProductIds().has(productId.toString());
  }
}

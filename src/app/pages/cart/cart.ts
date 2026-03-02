import { Component, inject, OnInit, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';

import { CartService } from '../../services/cart-service';
import { AuthenticationService } from '../../services/authentication-service';
import { ProductService } from '../../services/product';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatButtonModule, MatIconModule, MatListModule, MatDividerModule],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class Cart implements OnInit {
  private cartService = inject(CartService);
  private authService = inject(AuthenticationService);
  private productService = inject(ProductService);

  cartItems = signal<any[]>([]);
  total = signal<number>(0);
  loading = signal<boolean>(false);

  constructor() {
    effect(() => {
      const user = this.authService.currentUser();
      if (user && user.id) {
        this.loadCart(user.id);
      } else {
        this.cartItems.set([]);
      }
    });
  }

  ngOnInit() {
  }

  loadCart(userId: number) {
    this.loading.set(true);
    this.cartService.getCart().subscribe({
      next: (cartData: any) => {
        const items = cartData.items || [];
        this.cartItems.set(items);
        this.calculateTotal(items);
        this.loading.set(false);

        // Fetch real stock
        items.forEach((item: any) => {
          this.productService.getProduct(item.product.id).subscribe({
            next: (productData: any) => {
              const totalStock = productData.inventoryItems?.reduce((acc: number, inv: any) => acc + inv.stock, 0) || 0;
              this.cartItems.update(currentItems => {
                const idx = currentItems.findIndex(i => i.id === item.id);
                if (idx !== -1) {
                  const updated = [...currentItems];
                  updated[idx].product.stock = totalStock;
                  return updated;
                }
                return currentItems;
              });
            }
          });
        });
      },
      error: (err) => {
        console.error('Error cargando el carrito:', err);
        this.loading.set(false);
      }
    });
  }

  removeItem(cartItemId: number) {
    const user = this.authService.currentUser();

    this.cartService.removeFromCart(cartItemId).subscribe({
      next: () => {
        if (user && user.id) {
          this.loadCart(user.id);
        }
      },
      error: (err) => console.error('Error eliminando item:', err)
    });
  }

  calculateTotal(items: any[]) {
    const sum = items.reduce((acc, item) => {
      return acc + (item.product.price * item.quantity);
    }, 0);
    this.total.set(sum);
  }

  checkout() {
    if (!this.authService.currentUser()) {
      alert('Debes iniciar sesión para comprar');
      return;
    }

    this.loading.set(true);

    this.cartService.preparePayment().subscribe({
      next: (url: string) => {
        console.log('Redirigiendo a MercadoPago:', url);
        window.location.href = url;
      },
      error: (err) => {
        console.error('Error al iniciar pago:', err);
        alert('Error al conectar con MercadoPago. Revisa la consola.');
        this.loading.set(false);
      }
    });
  }


  updateQuantity(item: any, change: number) {
    const newQuantity = item.quantity + change;

    if (newQuantity < 1) return;

    if (newQuantity > item.product.stock) {
      alert(`No puedes agregar más, solo hay ${item.product.stock} unidades disponibles de este producto.`);
      return;
    }

    this.cartService.modifyCartItemQuantity(item.id, newQuantity).subscribe({
      next: (updatedCartData: any) => {
        const currentStocks = new Map(this.cartItems().map(i => [i.product.id, i.product.stock]));
        const newItems = updatedCartData.items.map((ni: any) => {
          ni.product.stock = currentStocks.get(ni.product.id);
          return ni;
        });

        this.cartItems.set(newItems);
        if (updatedCartData.totalPrice) {
          this.total.set(updatedCartData.totalPrice);
        } else {
          this.calculateTotal(newItems);
        }
      },
      error: (err) => {
        console.error('Error actualizando cantidad', err);
      }
    });
  }
}

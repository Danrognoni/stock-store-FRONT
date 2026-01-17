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
    this.cartService.getCart(userId).subscribe({
      next: (cartData: any) => {
        const items = cartData.items || [];
        this.cartItems.set(items);
        this.calculateTotal(items);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error cargando el carrito:', err);
        this.loading.set(false);
      }
    });
  }

  removeItem(cartItemId: number) {
    const user = this.authService.currentUser();
    if (!user || !user.id) return;

    this.cartService.removeFromCart(user.id, cartItemId).subscribe({
      next: () => {
        this.loadCart(user.id);
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
    const user = this.authService.currentUser();
    console.log("Procesando compra para:", user?.email);
  }
}

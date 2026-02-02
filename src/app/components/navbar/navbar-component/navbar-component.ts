import { Component, inject, input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { NavItem } from '../../../models/nav-item';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { AuthenticationService } from '../../../services/authentication-service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatBadgeModule } from '@angular/material/badge';
import { CartService } from '../../../services/cart-service';

@Component({
  selector: 'app-navbar-component',
  imports: [RouterLink, MatButtonModule, MatDividerModule, MatToolbarModule, MatMenuModule, MatIconModule, MatBadgeModule, RouterOutlet],
  templateUrl: './navbar-component.html',
  styleUrl: './navbar-component.css',
})
export class NavbarComponent implements OnInit{
  items = input.required<NavItem[]>();
  public authService = inject(AuthenticationService);
  public cartService = inject(CartService);
  private router = inject(Router);

  ngOnInit(): void {
    if (this.authService.currentUser()) {
      this.cartService.refreshCartCount();
    }
  }
  logout() {
  this.authService.logout().subscribe({
    next: () => {
      this.router.navigate(['/auth/login']);
    },
    error: (err) => {
      console.warn("Error en logout servidor, cerrando localmente", err);
      this.authService.currentUser.set(null);
      this.router.navigate(['/auth/login']);
    }
  });
}
}

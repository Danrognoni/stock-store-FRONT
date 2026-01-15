import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu'; // Opcional si usas menú responsive

interface NavItem {
  label: string;
  link: string;
  icon: string;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class NavbarComponent {

  navItems = signal<NavItem[]>([
    { label: 'Inicio', link: '/home', icon: 'home' },
    { label: 'Productos', link: '/products', icon: 'inventory_2' },
    { label: 'Proveedores', link: '/suppliers', icon: 'local_shipping' },
    { label: 'Inventario', link: '/inventory', icon: 'warehouse' },
    { label: 'Categorías', link: '/categories', icon: 'category' },
    { label: 'Tienda', link: '/store', icon: 'storefront' },
  ]);
}

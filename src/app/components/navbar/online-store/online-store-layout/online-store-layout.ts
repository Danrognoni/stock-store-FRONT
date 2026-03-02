import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../navbar-component/navbar-component';
import { NavItem } from '../../../../models/nav-item';

@Component({
  selector: 'app-online-store-layout',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './online-store-layout.html',
  styleUrl: './online-store-layout.css'
})
export class OnlineStoreLayoutComponent {
  storeNavItems: NavItem[] = [
    { label: 'Catálogo', route: '/online-store' },
    { label: 'Carrito', route: '/online-store/cart', roles: ['USER'] },
  ];
}
import { Component } from '@angular/core';
import { Navbar } from '../navbar/navbar';
import { RouterOutlet } from '@angular/router';
import { NavItem } from '../../models/nav-item';

@Component({
  selector: 'app-home-layout',
  imports: [Navbar, RouterOutlet],
  templateUrl: './home-layout.html',
  styleUrl: './home-layout.css',
})
export class HomeLayout {
  menu:NavItem[] = [
    {label: "Categorías", route: "/categories"},
    {label: "Inventario", route: "/inventory-items"},
    {label: "Proveedores", route: "/suppliers"},
    {label: "Tienda Online", route: "/online-store"},
    {label: "Productos", route: "/products"}
  ]
}

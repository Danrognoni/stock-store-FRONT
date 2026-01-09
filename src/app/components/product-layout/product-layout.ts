import { Component } from '@angular/core';
import { Navbar } from '../navbar/navbar';
import { RouterOutlet } from '@angular/router';
import { NavItem } from '../../models/nav-item';

@Component({
  selector: 'app-product-layout',
  imports: [Navbar, RouterOutlet],
  templateUrl: './product-layout.html',
  styleUrl: './product-layout.css',
})
export class ProductLayout {
  menu:NavItem[] = [
    {label: "Ver Productos", route : "/products"},
    {label: "Crear Producto", route : "/products/create"}
  ]
}

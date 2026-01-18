import { Component } from '@angular/core';
import { NavbarComponent } from "../navbar-component/navbar-component";
import { NavItem } from '../../../models/nav-item';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-home-layout',
  imports: [NavbarComponent, RouterOutlet],
  templateUrl: './home-layout.html',
  styleUrl: './home-layout.css',
})
export class HomeLayout {
  menu:NavItem[] = [
        {label: "Productos", route:"/products"},
        {label: "Inventario", route: "/inventory"},
        {label: "Proveedores", route:"/suppliers"},
        {label: "Tienda Online", route: "/online-store"},
        {label: "Tienda Local", route:"/local-store"}
    ]
}

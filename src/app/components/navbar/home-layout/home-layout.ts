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
        {label: "Productos", route:"/products", roles: ['ADMIN', 'EMPLOYEE']},
        {label: "Inventario", route: "/inventory", roles: ['ADMIN', 'EMPLOYEE']},
        {label: "Proveedores", route:"/suppliers", roles: ['ADMIN', 'EMPLOYEE']},
        {label: "Tienda Online", route: "/online-store", roles: ['ADMIN', 'USER']},
    ]
}

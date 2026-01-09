import { Component } from '@angular/core';
import { Navbar } from '../navbar/navbar';
import { RouterOutlet } from '@angular/router';
import { NavItem } from '../../models/nav-item';

@Component({
  selector: 'app-supplier-layout',
  imports: [Navbar, RouterOutlet],
  templateUrl: './supplier-layout.html',
  styleUrl: './supplier-layout.css',
})
export class SupplierLayout {
  menu:NavItem[] = [
      {label: "Ver Proveedores", route : "/suppliers"},
      {label: "Crear Proveedores", route : "/suppliers/create"}
    ]
}

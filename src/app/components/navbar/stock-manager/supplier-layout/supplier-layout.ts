import { Component } from '@angular/core';
import { NavbarComponent } from "../../navbar-component/navbar-component";
import { NavItem } from '../../../../models/nav-item';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-supplier-layout',
  standalone: true,
  imports: [NavbarComponent, RouterOutlet],
  templateUrl: './supplier-layout.html',
  styleUrl: './supplier-layout.css',
})
export class SupplierLayout {
  readonly menu: NavItem[] = [
    { label: "Ver proveedores", route: "list" },
    { label: "Crear proveedor", route: "create" }
  ];
}
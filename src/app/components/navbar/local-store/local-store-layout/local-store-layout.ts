import { Component } from '@angular/core';
import { NavbarComponent } from "../../navbar-component/navbar-component";
import { NavItem } from '../../../../models/nav-item';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-local-store-layout',
  imports: [NavbarComponent, RouterOutlet],
  templateUrl: './local-store-layout.html',
  styleUrl: './local-store-layout.css',
})
export class LocalStoreLayout {
  menu:NavItem[] = [
      {label: "Iniciar venta", route:"/inventory-items"},
      {label: "Ver ventas", route: "/inventory-items/create"}
  ]
}

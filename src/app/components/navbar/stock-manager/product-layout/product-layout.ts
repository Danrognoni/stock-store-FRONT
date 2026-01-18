import { Component } from '@angular/core';
import { NavbarComponent } from "../../navbar-component/navbar-component";
import { RouterOutlet } from "../../../../../../node_modules/@angular/router/types/_router_module-chunk";
import { NavItem } from '../../../../models/nav-item';

@Component({
  selector: 'app-product-layout',
  imports: [NavbarComponent, RouterOutlet],
  templateUrl: './product-layout.html',
  styleUrl: './product-layout.css',
})
export class ProductLayout {
  menu:NavItem[] = [
      {label: "Ver inventario", route:"/inventory-items"},
      {label: "Crear ítem de inventario", route: "/inventory-items/create"}
  ]
}

import { Component } from '@angular/core';
import { NavbarComponent } from "../../navbar-component/navbar-component";
import { RouterOutlet } from "../../../../../../node_modules/@angular/router/types/_router_module-chunk";
import { NavItem } from '../../../../models/nav-item';

@Component({
  selector: 'app-inventory-item-layout',
  imports: [NavbarComponent, RouterOutlet],
  templateUrl: './inventory-item-layout.html',
  styleUrl: './inventory-item-layout.css',
})
export class InventoryItemLayout {
  menu:NavItem[] = [
      {label: "Ver inventario", route:"/inventory-items"},
      {label: "Crear ítem de inventario", route: "/inventory-items/create"}
  ]
}

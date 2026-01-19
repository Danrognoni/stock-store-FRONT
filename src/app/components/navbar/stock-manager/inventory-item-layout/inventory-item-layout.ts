import { Component } from '@angular/core';
import { NavbarComponent } from "../../navbar-component/navbar-component";
import { NavItem } from '../../../../models/nav-item';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-inventory-item-layout',
  imports: [NavbarComponent, RouterOutlet],
  templateUrl: './inventory-item-layout.html',
  styleUrl: './inventory-item-layout.css',
})
export class InventoryItemLayout {
  menu:NavItem[] = [
      {label: "Ver inventario", route:"list"},
      {label: "Crear ítem de inventario", route: "create"}
  ]
}

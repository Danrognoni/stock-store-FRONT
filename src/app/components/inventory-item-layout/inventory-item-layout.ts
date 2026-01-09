import { Component } from '@angular/core';
import { Navbar } from '../navbar/navbar';
import { RouterOutlet } from '@angular/router';
import { NavItem } from '../../models/nav-item';

@Component({
  selector: 'app-inventory-item-layout',
  imports: [Navbar, RouterOutlet],
  templateUrl: './inventory-item-layout.html',
  styleUrl: './inventory-item-layout.css',
})
export class InventoryItemLayout {
  menu:NavItem[] = [
      {label: "Ver inventario", route : "/inventory-items"},
      {label: "Crear Ítem de Inventario", route : "/inventory-items/create"}
    ]
}

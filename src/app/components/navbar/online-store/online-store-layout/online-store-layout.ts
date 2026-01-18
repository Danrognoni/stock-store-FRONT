import { Component } from '@angular/core';
import { NavbarComponent } from "../../navbar-component/navbar-component";
import { NavItem } from '../../../../models/nav-item';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-online-store-layout',
  imports: [NavbarComponent, RouterOutlet],
  templateUrl: './online-store-layout.html',
  styleUrl: './online-store-layout.css',
})
export class OnlineStoreLayout {
  menu:NavItem[] = [
      {label: "Ver productos", route:"/inventory-items"},
      {label: "Mis compras", route: "/inventory-items/create"}
  ]
}

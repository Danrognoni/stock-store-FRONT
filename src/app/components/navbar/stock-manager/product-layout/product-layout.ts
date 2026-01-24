import { Component } from '@angular/core';
import { NavbarComponent } from "../../navbar-component/navbar-component";
import { NavItem } from '../../../../models/nav-item';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-product-layout',
  imports: [NavbarComponent, RouterOutlet],
  templateUrl: './product-layout.html',
  styleUrl: './product-layout.css',
})
export class ProductLayout {
  menu:NavItem[] = [
      {label: "Ver productos", route:"list"},
      {label: "Crear productos", route: "create"},
      {label: "Crear categoría", route: "category/create"},
      {label: "Ver categorías", route:"category/list"}
  ]
}

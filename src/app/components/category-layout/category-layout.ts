import { Component } from '@angular/core';

import { RouterOutlet } from '@angular/router';
import { NavItem } from '../../models/nav-item';


@Component({
  selector: 'app-category-layout',
  imports:  [RouterOutlet],
  templateUrl: './category-layout.html',
  styleUrl: './category-layout.css',
})
export class CategoryLayout {
  menu:NavItem[] = [
    {label: "Ver Categorías", route : "/categories"},
    {label: "Crear Categorías", route : "/categories/create"}
  ]
}

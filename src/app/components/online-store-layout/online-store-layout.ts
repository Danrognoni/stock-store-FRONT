import { Component } from '@angular/core';
import { Navbar } from '../navbar/navbar';
import { RouterOutlet } from '@angular/router';
import { NavItem } from '../../models/nav-item';

@Component({
  selector: 'app-online-store-layout',
  imports: [Navbar, RouterOutlet],
  templateUrl: './online-store-layout.html',
  styleUrl: './online-store-layout.css',
})
export class OnlineStoreLayout {
  menu:NavItem[] = [
      {label: "Opcion 1", route : "/products"},
      {label: "Opcion 2", route : "/products/create"},
      {label: "Opcion 3", route: ""}
    ]
}

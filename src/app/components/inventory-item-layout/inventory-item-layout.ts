import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar';
import { NavItem } from '../../models/nav-item';

@Component({
  selector: 'app-inventory-item-layout',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './inventory-item-layout.html'
})
export class InventoryItemLayout {

}

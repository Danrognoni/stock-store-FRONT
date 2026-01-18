import { Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { NavItem } from '../../../models/nav-item';

@Component({
  selector: 'app-navbar-component',
  imports: [RouterLink, MatButtonModule],
  templateUrl: './navbar-component.html',
  styleUrl: './navbar-component.css',
})
export class NavbarComponent {
  items = input.required<NavItem[]>();
}

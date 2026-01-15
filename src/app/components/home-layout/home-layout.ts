import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar'; // [!code change] Update import name

@Component({
  selector: 'app-home-layout',
  standalone: true,
  imports: [NavbarComponent, RouterOutlet], // [!code change] Update component name
  templateUrl: './home-layout.html',
  styleUrl: './home-layout.html' // (Verify this extension, usually .css or .scss)
})
export class HomeLayout {}

import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { ProductService } from '../../services/product';
import { ProductList } from '../../models/product/product-list';
import { NavbarComponent } from '../navbar/navbar'; // [!code change] Update import
import { RouterOutlet } from '@angular/router'; // Ensure this is imported if used

@Component({
  selector: 'app-online-store-layout',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatBadgeModule,
    NavbarComponent // [!code change] Update component name
    // RouterOutlet // Add if you use <router-outlet> in the HTML
  ],
  templateUrl: './online-store-layout.html',
  styleUrl: './online-store-layout.css'
})
export class OnlineStoreLayout  {

}

import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router'; // Importar Link y Active
import { MatButtonModule } from '@angular/material/button'; // Para los botones del submenú
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';


@Component({
  selector: 'app-product-layout',
  standalone: true,
  imports: [RouterOutlet,  RouterLink, RouterLinkActive, MatButtonModule, MatToolbarModule, MatCardModule],
  templateUrl: './product-layout.html',
  styleUrls: ['./product-layout.css']
})
export class ProductLayout {

}

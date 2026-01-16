import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router'; // Importar Link y Active
import { MatButtonModule } from '@angular/material/button'; // Para los botones del submenú
import { MatToolbarModule } from '@angular/material/toolbar';


@Component({
  selector: 'app-product-layout',
  standalone: true,
  imports: [RouterOutlet,  RouterLink, RouterLinkActive, MatButtonModule, MatToolbarModule],
  templateUrl: './product-layout.html',
  styleUrls: ['./product-layout.css']
})
export class ProductLayout {

}

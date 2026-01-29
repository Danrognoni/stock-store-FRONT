import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ProductService } from '../../../services/product';
import { CartService } from '../../../services/cart-service';
import { NavbarComponent } from '../../../components/navbar/navbar-component/navbar-component';


@Component({
  selector: 'app-store-catalog',
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatButtonModule, MatIconModule, NavbarComponent, RouterOutlet],
  templateUrl: './catalog.html',
  styleUrls: ['./catalog.css'] 
})
export class StoreCatalogComponent implements OnInit {
  private productService = inject(ProductService);
  private cartService = inject(CartService);


  products = signal<any[]>([]);

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getProducts(0, 50).subscribe({
      next: (data: any) => {
        this.products.set(data.content);
      },
      error: (err) => console.error('Error cargando catálogo', err)
    });
  }

  addToCart(product: any) {
    this.cartService.addItemToCart(product.id, 1).subscribe({
      next: () => {
        alert('Producto agregado al carrito');
      },
      error: (err) => {
        console.error(err);
        alert('Error al agregar. ¿Estás logueado?');
      }
    });
  }
}
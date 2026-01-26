import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../../../services/product';
import { ProductDet } from '../../../models/product/product-det';

@Component({
  selector: 'app-product-detail',
  standalone: true, // Asegúrate de que sea standalone si usas imports directos
  imports: [MatCardModule, MatListModule, MatIconModule, MatButtonModule, RouterLink],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css',
})
export class ProductDetail implements OnInit {
  private router = inject(Router);
  private ruta = inject(ActivatedRoute);
  public productService = inject(ProductService);
  
  public product = signal<ProductDet | null>(null);

  ngOnInit(): void {
    this.getProductById();
  }

  getProductById() {
    const id = this.ruta.snapshot.paramMap.get('id');
    if (id) {
      this.productService.getProduct(id).subscribe({
        next: (data) => this.product.set(data),
        error: (e) => console.error(e)
      });
    }
  }

  getBack() {
    this.router.navigate(['/products/list']);
  }
}

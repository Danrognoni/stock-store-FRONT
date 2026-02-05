import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; 
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../../../services/product';
import { ProductDet } from '../../../models/product/product-det';

@Component({
  selector: 'app-product-detail',
  standalone: true, 
  imports: [CommonModule, MatCardModule, MatListModule, MatIconModule, MatButtonModule, RouterLink, MatProgressSpinnerModule],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css',
})
export class ProductDetail implements OnInit {
  private router = inject(Router);
  private ruta = inject(ActivatedRoute);
  public productService = inject(ProductService);
  
  public product = signal<ProductDet | null>(null);
  public loading = signal<boolean>(true);

  ngOnInit(): void {
    this.ruta.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.getProductById(id);
      } else {
        this.loading.set(false); 
      }
    });
  }

  getProductById(id: string) {
    this.loading.set(true);
    this.productService.getProduct(id).subscribe({
      next: (data) => {
        this.product.set(data);
        this.loading.set(false); 
      },
      error: (e) => {
        console.error('Error cargando producto:', e);
        this.loading.set(false); 
      }
    });
  }

  getBack() {
    this.router.navigate(['/online-store']); 
  }
}
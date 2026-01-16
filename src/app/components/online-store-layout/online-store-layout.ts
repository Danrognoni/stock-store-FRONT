import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { ProductDet } from '../../models/product/product-det';
import { ProductService } from '../../services/product';
import { CartService } from '../../services/cart-service';
import { CartItemRequest } from '../../models/cartItem/cart-item-request';


@Component({
  selector: 'app-online-store-layout',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatBadgeModule,
  ],
  templateUrl: './online-store-layout.html',
  styleUrl: './online-store-layout.css'
})
// Pseudocódigo para guiarte
export class OnlineStoreLayout implements OnInit {

  products = signal<ProductDet[]>([]);
  private productService = inject(ProductService);
  private cartService = inject(CartService);

  totalElements = signal<number>(0);
  pageIndex = signal<number>(0);
  pageSize = signal<number>(18);

  ngOnInit() {
    this.productService.getProducts(this.pageIndex(), this.pageSize()).subscribe(
      data => {
      this.products.set(data);
      this.totalElements.set(data.page.totalElements);
    });
  }

}


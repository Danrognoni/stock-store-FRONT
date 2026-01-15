import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { supplierService } from '../../../services/supplier';
import { SupplierDet } from '../../../models/supplier/supplier-det';

@Component({
  selector: 'app-supplier-detail',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatListModule, MatIconModule, MatDividerModule, RouterLink],
  templateUrl: './supplier-detail.html',
  styleUrl: './supplier-detail.css'
})
export class SupplierDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private supplierService = inject(supplierService);

  supplier = signal<SupplierDet | null>(null);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.supplierService.getSupplier(id).subscribe({
        next: (data) => this.supplier.set(data),
        error: (error) => console.error(error)
      });
    }
  }
}

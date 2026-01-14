import { Component, inject, OnInit, signal } from '@angular/core';
import { CategoryDet } from '../../models/category/category-det';
import { CategoryService } from '../../services/category';

@Component({
  selector: 'app-category',
  imports: [],
  templateUrl: './category.html',
  styleUrl: './category.css',
})
export class Category implements OnInit {

  totalElements = signal<number>(0);
  pageIndex = signal<number>(0);
  pageSize = signal<number>(18);


}

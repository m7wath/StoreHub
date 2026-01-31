import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';

import { ProductsApiService } from '../../../Services/products-api.service';
import { CategoriesApiService } from '../../../Services/categories-api.service';
import { ProductCardComponent } from '../../../shared/product-card/product-card.component';

import { ProductApi } from '../../../Models/product-api.model';
import { CategoryApi } from '../../../Models/category-api.model';

export interface ProductVm {
  id: number;
  name: string;
  price: number;
  quantity: number;
  categoryId: number | null;
  categoryName: string;
  imageUrl: string;
}

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [FormsModule, NgxPaginationModule, ProductCardComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductsComponent implements OnInit {
  page = 1;
  pageSize = 9;

  search = '';
  selectedCategoryId: number | 'all' = 'all';
  sort: 'default' | 'priceAsc' | 'priceDesc' | 'nameAsc' = 'default';

  loading = false;
  error = '';

  products: ProductVm[] = [];
  categories: CategoryApi[] = [];

  constructor(
    private productsApi: ProductsApiService,
    private categoriesApi: CategoriesApiService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
  }

  loadCategories() {
    this.categoriesApi.getList('', 1, 1000).subscribe({
      next: (res) => (this.categories = res ?? []),
      error: () => console.log('Failed to load categories'),
    });
  }

  loadProducts() {
    this.loading = true;
    this.error = '';

    this.productsApi.getList('', 1, 1000).subscribe({
      next: (res) => {
        this.products = (res ?? []).map((p: ProductApi) => ({
          id: p.id,
          name: p.name,
          price: p.price,
          quantity: p.quantity ?? 0,
          categoryId: p.categoryId ?? null,
          categoryName: p.category?.name ?? 'Unknown',
          imageUrl: p.imageUrl ?? 'https://picsum.photos/seed/storehub-' + p.id + '/800/500',
        }));

        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load products';
        this.loading = false;
      },
    });
  }

  resetPage() {
    this.page = 1;
  }

  get filteredProducts(): ProductVm[] {
    let list = [...this.products];

    const q = this.search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.categoryName.toLowerCase().includes(q) ||
          p.id.toString().includes(q)
      );
    }

    if (this.selectedCategoryId !== 'all') {
      const cid = Number(this.selectedCategoryId);
      list = list.filter((p) => p.categoryId === cid);
    }

    if (this.sort === 'priceAsc') list.sort((a, b) => a.price - b.price);
    if (this.sort === 'priceDesc') list.sort((a, b) => b.price - a.price);
    if (this.sort === 'nameAsc') list.sort((a, b) => a.name.localeCompare(b.name));

    return list;
  }
}

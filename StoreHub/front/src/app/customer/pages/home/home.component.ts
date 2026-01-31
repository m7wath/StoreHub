import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { ProductCardComponent } from '../../../shared/product-card/product-card.component';
import { ProductsApiService } from '../../../Services/products-api.service';
import { AuthService } from '../../../Services/auth.service';

type HomeProductVm = {
  id: number;
  name: string;
  price: number;
  categoryId: number | null;
  categoryName: string;
  imageUrl: string;
};

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, ProductCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  constructor(public auth: AuthService, private productsApi: ProductsApiService) {}

  loading = false;
  error = '';

  featured: HomeProductVm[] = [];

  categories = [
    { title: 'Graphics Cards', key: 'GPU', icon: '🎮' },
    { title: 'Processors', key: 'CPU', icon: '⚙️' },
    { title: 'Memory', key: 'RAM', icon: '🧠' },
    { title: 'Storage', key: 'SSD', icon: '💾' },
    { title: 'Monitors', key: 'Monitor', icon: '🖥️' },
    { title: 'Keyboards', key: 'Keyboard', icon: '⌨️' },
  ];

  ngOnInit(): void {
    this.loadHomeProducts();
  }

  loadHomeProducts() {
    this.loading = true;
    this.error = '';

    this.productsApi.getList('', 1, 6).subscribe({
      next: (res: any) => {
    
        const items = res?.items ?? res ?? [];

        this.featured = items.map((p: any) => ({
          id: p.id,
          name: p.name,
          price: p.price,
          categoryId: p.categoryId ?? null,
          categoryName: p.categoryName ?? p.category?.name ?? '',
          imageUrl: p.imageUrl ?? 'https://picsum.photos/seed/storehub-fallback/900/600',
        }));

        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Failed to load products. Please try again.';
        this.loading = false;
      },
    });
  }
}

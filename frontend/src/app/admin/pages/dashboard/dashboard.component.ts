import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdminApiService } from '../../../Services/admin-api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  loading = false;
  error = '';

  stats = [
    { title: 'Products', value: 0, hint: 'Total products in catalog' },
    { title: 'Orders', value: 0, hint: 'Orders in system' },
    { title: 'Categories', value: 0, hint: 'Available categories' },
    { title: 'Users', value: 0, hint: 'Registered users' },
  ];

  quick = [
    { title: 'Manage Products', desc: 'Create / edit / delete products', link: '/admin/products' },
    { title: 'Manage Categories', desc: 'Create / edit categories', link: '/admin/categories' },
    { title: 'Manage Orders', desc: 'View and update orders', link: '/admin/orders' },
  ];

  constructor(private adminApi: AdminApiService) {}

  ngOnInit(): void {
    this.loading = true;

    this.adminApi.getStats().subscribe({
      next: (x) => {
        this.stats = [
          { title: 'Products', value: x.products, hint: 'Total products in catalog' },
          { title: 'Orders', value: x.orders, hint: 'Orders in system' },
          { title: 'Categories', value: x.categories, hint: 'Available categories' },
          { title: 'Users', value: x.users, hint: 'Registered users' },
        ];
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Failed to load dashboard stats';
        this.loading = false;
      },
    });
  }
}

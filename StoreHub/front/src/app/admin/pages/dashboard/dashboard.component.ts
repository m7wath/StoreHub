import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { AdminApiService } from '../../../Services/admin-api.service';

type StatsVm = {
  title: string;
  value: number;
  hint: string;
};

type QuickVm = {
  title: string;
  desc: string;
  link: string;
};

type DashboardStatsApi = {
  products: number;
  orders: number;
  categories: number;
  users: number;
};

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

  stats: StatsVm[] = [];
  quick: QuickVm[] = [];

constructor(private api: AdminApiService) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats() {
    this.loading = true;
    this.error = '';

    this.api.getStats().subscribe({
      next: (res: DashboardStatsApi) => {

        this.stats = [
          {
            title: 'Products',
            value: res.products ?? 0,
            hint: 'Total products in catalog'
          },
          {
            title: 'Orders',
            value: res.orders ?? 0,
            hint: 'Orders in system'
          },
          {
            title: 'Categories',
            value: res.categories ?? 0,
            hint: 'Available categories'
          },
          {
            title: 'Users',
            value: res.users ?? 0,
            hint: 'Registered users'
          }
        ];

        this.quick = [
          {
            title: 'Manage Products',
            desc: 'Create / edit / delete products',
            link: '/admin/products'
          },
          {
            title: 'Manage Categories',
            desc: 'Create / edit categories',
            link: '/admin/categories'
          },
          {
            title: 'Manage Orders',
            desc: 'View and update orders',
            link: '/admin/orders'
          },
          {
            title: 'Manage Users',
            desc: 'Edit roles & reset passwords',
            link: '/admin/users'
          }
        ];

        this.loading = false;
      },

      error: () => {
        this.error = 'Failed to load dashboard stats';
        this.loading = false;
      }
    });
  }
}

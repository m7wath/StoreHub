import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';

import { OrdersApiService, OrderListApi, OrderDetailsApi } from '../../../Services/orders-api.service';

type AdminOrderVm = {
  id: number;
  customerText: string; 
  itemsCount: number;
  total: number;
  createdAt: string;
};

@Component({
  selector: 'app-orders-management',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPaginationModule],
  templateUrl: './orders-management.component.html',
  styleUrl: './orders-management.component.css',
})
export class OrdersManagementComponent implements OnInit {
  search = '';
  page = 1;
  pageSize = 10;

  loading = false;
  error = '';

  orders: AdminOrderVm[] = [];
  totalCount = 0;

  viewing = false;
  viewError = '';
  viewOrder?: OrderDetailsApi;

  constructor(private ordersApi: OrdersApiService) {}

  ngOnInit(): void {
    this.load();
  }

  resetPage() {
    this.page = 1;
  }

  load() {
  this.loading = true;
  this.error = '';

  this.ordersApi.search(this.search, this.page, this.pageSize).subscribe({
    next: (res) => {
      const list = res?.items ?? [];

      this.totalCount = res?.totalCount ?? 0;

      this.orders = list.map(o => ({
        id: o.id,
        customerText: `User #${o.userId}`,
        itemsCount: o.itemsCount ?? 0,
        total: o.totalPrice,
        createdAt: (o.orderDate ?? '').slice(0, 10) || '',
      }));

      this.loading = false;
    },
    error: (err) => {
      console.error(err);
      this.error = 'Failed to load orders';
      this.loading = false;
    }
  });
}

  onSearchChange() {
    this.resetPage();
    this.load();
  }

  onPageChange(p: number) {
    this.page = p;
    this.load();
  }

  view(id: number) {
    this.viewing = true;
    this.viewError = '';
    this.viewOrder = undefined;

    this.ordersApi.getById(id).subscribe({
      next: (x) => {
        this.viewOrder = x;
        this.viewing = false;

        const lines = (x.items ?? []).map(i => {
          const name = i.product?.name ?? `ProductId=${i.productId}`;
          return `- ${name} x${i.quantity}`;
        });

        alert(
          `Order #${x.id}\nUserId: ${x.userId}\nTotal: $${x.totalPrice}\nDate: ${x.orderDate}\n\nItems:\n${lines.join('\n')}`
        );
      },
      error: (err) => {
        console.error(err);
        this.viewError = 'Failed to load order details';
        this.viewing = false;
        alert(this.viewError);
      }
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersApiService, OrderListApi } from '../../../Services/orders-api.service';
import { AuthService } from '../../../Services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  userName = 'User';
  loading = false;
  error = '';

  pageNumber = 1;
  pageSize = 10;
  totalCount = 0;

  orders: OrderListApi[] = [];

  constructor(
    private ordersApi: OrdersApiService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.userName = this.auth.getUserName() ?? 'User';
    if (!this.auth.isLoggedIn) {
      this.error = 'Please login first.';
      return;
    }

    this.load();
  }

  get hasPrev(): boolean {
    return this.pageNumber > 1;
  }

  get hasNext(): boolean {
    return this.pageNumber * this.pageSize < this.totalCount;
  }

  load() {
  this.loading = true;
  this.error = '';

  this.ordersApi.getMy(this.pageNumber, this.pageSize).subscribe({
    next: (res: any) => {
      console.log("MY ORDERS:", res);

      this.orders = res;
      this.totalCount = res.length;

      this.loading = false;
    },
    error: (err) => {
      console.error(err);
      this.loading = false;
      this.error =
        err?.status === 401
          ? 'Please login first.'
          : 'Failed to load orders.';
    },
  });
}


  next() {
    if (!this.hasNext) return;
    this.pageNumber++;
    this.load();
  }

  prev() {
    if (!this.hasPrev) return;
    this.pageNumber--;
    this.load();
  }
}

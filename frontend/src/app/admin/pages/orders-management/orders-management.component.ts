import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';

type AdminOrderVm = {
  id: number;
  customerName: string;
  itemsCount: number;
  total: number;
  status: 'Pending' | 'Paid' | 'Shipped' | 'Cancelled';
  createdAt: string;
};

@Component({
  selector: 'app-orders-management',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPaginationModule],
  templateUrl: './orders-management.component.html',
  styleUrl: './orders-management.component.css',
})
export class OrdersManagementComponent {
  search = '';
  status = 'all';
  page = 1;
  pageSize = 10;

  orders: AdminOrderVm[] = Array.from({ length: 75 }).map((_, i) => {
    const id = i + 1;

    const names = ['Mohammed', 'Ahmad', 'Ali', 'Omar', 'Khaled', 'Sara', 'Lina', 'Noor', 'Yousef', 'Hanan'];
    const customerName = names[i % names.length] + ` #${(id % 20) + 1}`;

    const itemsCount = (id % 6) + 1;
    const total = 50 * itemsCount + (id % 10) * 25;

    const statuses: AdminOrderVm['status'][] = ['Pending', 'Paid', 'Shipped', 'Cancelled'];
    const status = statuses[id % statuses.length];

    const createdAt = this.fakeDate(id);

    return { id, customerName, itemsCount, total, status, createdAt };
  });

  resetPage() {
    this.page = 1;
  }

  get filtered(): AdminOrderVm[] {
    const s = this.search.trim().toLowerCase();

    let list = [...this.orders];

    if (this.status !== 'all') {
      list = list.filter(o => o.status === this.status);
    }

    if (s) {
      list = list.filter(o =>
        String(o.id).includes(s) ||
        o.customerName.toLowerCase().includes(s)
      );
    }

    list.sort((a, b) => b.id - a.id);
    return list;
  }

  view(o: AdminOrderVm) {
    alert(`UI only: View Order #${o.id}`);
  }

  changeStatus(o: AdminOrderVm, newStatus: AdminOrderVm['status']) {
    this.orders = this.orders.map(x => (x.id === o.id ? { ...x, status: newStatus } : x));
  }

  private fakeDate(id: number): string {
    const day = (id % 28) + 1;
    const month = ((id % 12) + 1);
    const yyyy = 2025;
    return `${yyyy}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }
}

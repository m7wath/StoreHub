import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../core/api.config';

export type PagedResult<T> = {
  items: T[];
  totalCount: number;
};

export type OrderItemApi = {
  id?: number;
  productId: number;
  quantity: number;
  product?: { id: number; name: string; price: number };
};

export type OrderDetailsApi = {
  id: number;
  userId: number;
  orderDate: string;
  totalPrice: number;
  items: OrderItemApi[];
};

export type OrderListApi = {
  id: number;
  userId: number;
  orderDate: string;
  totalPrice: number;
  itemsCount?: number; // ✅ الأفضل نخليه موجود من الباك
};

@Injectable({ providedIn: 'root' })
export class OrdersApiService {
  private url = `${API_BASE_URL}/api/Orders`;

  constructor(private http: HttpClient) {}

  // ✅ Admin: list/search (PagedResult)
  search(value = '', pageNumber = 1, pageSize = 10) {
    const url =
      `${this.url}` +
      `?value=${encodeURIComponent(value)}` +
      `&pageNumber=${pageNumber}` +
      `&pageSize=${pageSize}`;

    return this.http.get<PagedResult<OrderListApi>>(url);
  }

  // ✅ Admin: details
  getById(id: number) {
    return this.http.get<OrderDetailsApi>(`${this.url}/${id}`);
  }
}

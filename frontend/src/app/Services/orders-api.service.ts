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
  itemsCount?: number; 
};

@Injectable({ providedIn: 'root' })
export class OrdersApiService {
  private url = `${API_BASE_URL}/api/Orders`;

  constructor(private http: HttpClient) {}

  search(value = '', pageNumber = 1, pageSize = 10) {
    const url =
      `${this.url}` +
      `?value=${encodeURIComponent(value)}` +
      `&pageNumber=${pageNumber}` +
      `&pageSize=${pageSize}`;

    return this.http.get<PagedResult<OrderListApi>>(url);
  }

  getById(id: number) {
    return this.http.get<OrderDetailsApi>(`${this.url}/${id}`);
  }
  create(dto: {
  items: { productId: number; quantity: number }[];
}) {
  return this.http.post(this.url, dto);
}

getMy(pageNumber = 1, pageSize = 10) {
  const url =
    `${this.url}/my?pageNumber=${pageNumber}&pageSize=${pageSize}`;
  return this.http.get<PagedResult<OrderListApi>>(url);
}
}

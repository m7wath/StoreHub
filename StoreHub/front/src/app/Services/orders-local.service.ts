import { Injectable } from '@angular/core';
import { CartItem } from '../interfaces/CarItem';

export type LocalOrder = {
  id: string;
  createdAt: string;

  customerName: string;
  email: string;
  phone: string;

  address1: string;
  city: string;
  notes?: string;

  items: CartItem[];
  subtotal: number;
};

@Injectable({ providedIn: 'root' })
export class OrdersLocalService {
  private key = 'storehub_orders';

  create(order: Omit<LocalOrder, 'id' | 'createdAt'>): LocalOrder {
    const orders = this.read();
    const newOrder: LocalOrder = {
      ...order,
      id: this.newId(),
      createdAt: new Date().toISOString(),
    };
    orders.unshift(newOrder);
    this.write(orders);
    return newOrder;
  }

  getById(id: string): LocalOrder | undefined {
    return this.read().find(o => o.id === id);
  }

  getAll(): LocalOrder[] {
    return this.read();
  }

  private read(): LocalOrder[] {
    try {
      const raw = localStorage.getItem(this.key);
      const data = raw ? JSON.parse(raw) : [];
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  }

  private write(orders: LocalOrder[]) {
    localStorage.setItem(this.key, JSON.stringify(orders));
  }

  private newId(): string {
    return 'ORD-' + Math.random().toString(16).slice(2, 10).toUpperCase();
  }
}

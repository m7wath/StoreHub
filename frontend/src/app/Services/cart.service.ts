import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from '../interfaces/CarItem';

@Injectable({ providedIn: 'root' })
export class CartService {
  private storageKey = 'storehub_cart';

  private itemsSubject = new BehaviorSubject<CartItem[]>(this.read());
  items$ = this.itemsSubject.asObservable();

  sync() {
    this.itemsSubject.next(this.read());
  }

  getItems(): CartItem[] {
    return this.itemsSubject.value;
  }

  getCount(): number {
    return this.getItems().reduce((sum, i) => sum + i.quantity, 0);
  }

  getTotal(): number {
    return this.getItems().reduce((sum, i) => sum + i.price * i.quantity, 0);
  }

  add(item: Omit<CartItem, 'quantity'>, qty: number = 1) {
    const items = [...this.getItems()];
    const existing = items.find(x => x.id === item.id);

    if (existing) existing.quantity += qty;
    else items.push({ ...item, quantity: qty });

    this.commit(items);
  }

  inc(id: number) {
    const items = [...this.getItems()];
    const it = items.find(x => x.id === id);
    if (!it) return;

    it.quantity += 1;
    this.commit(items);
  }

  dec(id: number) {
    const items = [...this.getItems()];
    const it = items.find(x => x.id === id);
    if (!it) return;

    it.quantity -= 1;

    if (it.quantity <= 0) {
      this.commit(items.filter(x => x.id !== id));
      return;
    }

    this.commit(items);
  }

  remove(id: number) {
    this.commit(this.getItems().filter(x => x.id !== id));
  }

  clear() {
    this.commit([]);
  }
  private commit(items: CartItem[]) {
    this.itemsSubject.next(items);
    this.write(items);
  }

  private read(): CartItem[] {
    try {
      const raw = localStorage.getItem(this.storageKey);
      const data = raw ? JSON.parse(raw) : [];
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  }

  private write(items: CartItem[]) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(items));
    } catch {
     
    }
  }
}

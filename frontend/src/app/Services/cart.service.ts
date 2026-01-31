import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from '../interfaces/CarItem';

@Injectable({ providedIn: 'root' })
export class CartService {
  private itemsSubject = new BehaviorSubject<CartItem[]>([
    // Dummy items عشان تشوف شكل الجدول
    { id: 10, name: 'Gaming Product 10', price: 150, imageUrl: 'https://picsum.photos/seed/storehub-10/600/400', quantity: 1 },
    { id: 12, name: 'Gaming Product 12', price: 170, imageUrl: 'https://picsum.photos/seed/storehub-12/600/400', quantity: 2 },
    { id: 15, name: 'Gaming Product 15', price: 200, imageUrl: 'https://picsum.photos/seed/storehub-15/600/400', quantity: 1 },
  ]);

  items$ = this.itemsSubject.asObservable();

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
    this.itemsSubject.next(items);
  }

  inc(id: number) {
    const items = [...this.getItems()];
    const it = items.find(x => x.id === id);
    if (!it) return;
    it.quantity += 1;
    this.itemsSubject.next(items);
  }

  dec(id: number) {
    const items = [...this.getItems()];
    const it = items.find(x => x.id === id);
    if (!it) return;
    it.quantity -= 1;
    if (it.quantity <= 0) {
      this.itemsSubject.next(items.filter(x => x.id !== id));
      return;
    }
    this.itemsSubject.next(items);
  }

  remove(id: number) {
    this.itemsSubject.next(this.getItems().filter(x => x.id !== id));
  }

  clear() {
    this.itemsSubject.next([]);
  }
}

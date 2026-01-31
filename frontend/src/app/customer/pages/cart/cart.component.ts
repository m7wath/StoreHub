import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';

import { CartService } from '../../../Services/cart.service';
import { CartItem } from '../../../interfaces/CarItem';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent implements OnInit, OnDestroy {
  items: CartItem[] = [];
  private sub?: Subscription;

  constructor(private cart: CartService) {}

  ngOnInit(): void {
    this.cart.sync();

    this.sub = this.cart.items$.subscribe(items => (this.items = items));
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  inc(id: number) { this.cart.inc(id); }
  dec(id: number) { this.cart.dec(id); }
  remove(id: number) { this.cart.remove(id); }
  clear() { this.cart.clear(); }

  lineTotal(i: CartItem) { return i.price * i.quantity; }
  total() { return this.cart.getTotal(); }
}

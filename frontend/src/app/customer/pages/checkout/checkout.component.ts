import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { CartService } from '../../../Services/cart.service';
import { OrdersLocalService } from '../../../Services/orders-local.service';
import { CartItem } from '../../../interfaces/CarItem';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
})
export class CheckoutComponent implements OnInit {
  items: CartItem[] = [];
  subtotal = 0;

  customerName = '';
  email = '';
  phone = '';
  address1 = '';
  city = '';
  notes = '';

  error = '';
  placing = false;

  constructor(
    private cart: CartService,
    private orders: OrdersLocalService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cart.sync();
    this.items = this.cart.getItems();
    this.subtotal = this.cart.getTotal();
  }

  placeOrder() {
    this.error = '';

    if (this.items.length === 0) {
      this.error = 'Your cart is empty.';
      return;
    }

    if (!this.customerName || !this.email || !this.phone || !this.address1 || !this.city) {
      this.error = 'Please fill all required fields.';
      return;
    }

    this.placing = true;

    const order = this.orders.create({
      customerName: this.customerName.trim(),
      email: this.email.trim(),
      phone: this.phone.trim(),
      address1: this.address1.trim(),
      city: this.city.trim(),
      notes: this.notes.trim(),
      items: this.items,
      subtotal: this.subtotal,
    });

    this.cart.clear();
    this.placing = false;

    this.router.navigateByUrl(`/checkout/success/${order.id}`);
  }
}

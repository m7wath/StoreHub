import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { CartService } from '../../../Services/cart.service';
import { OrdersApiService } from '../../../Services/orders-api.service';
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
    private router: Router,
    private ordersApi: OrdersApiService
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

    const dto = {
      items: this.items.map(i => ({
        productId: i.id,    
        quantity: i.quantity  
      }))
    };

    this.ordersApi.create(dto).subscribe({
      next: () => {
        this.cart.clear();
        this.placing = false;

        this.router.navigateByUrl(`/checkout/success`);
      },
      error: (err) => {
        console.error(err);
        this.placing = false;

        if (err?.status === 401) {
          this.error = 'Please login first.';
          return;
        }

        this.error = 'Failed to place order. Please try again.';
      }
    });
  }
}

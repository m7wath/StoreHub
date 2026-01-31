import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

import { CartService } from '../../Services/cart.service';

export interface ProductVm {
  id: number;
  name: string;
  price: number;

  categoryId: number | null;
  categoryName: string;

  imageUrl: string;
}

type CardMode = 'customer' | 'admin';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css',
})
export class ProductCardComponent {
  @Input({ required: true }) product!: ProductVm;
  @Input() mode: CardMode = 'customer';

  @Output() edit = new EventEmitter<ProductVm>();
  @Output() remove = new EventEmitter<number>();

  constructor(
    private cart: CartService,
    private router: Router
  ) {}

  get isAdminMode(): boolean {
    return this.mode === 'admin';
  }

  addToCart() {
    this.cart.add({
      id: this.product.id,
      name: this.product.name,
      price: this.product.price,
      imageUrl: this.product.imageUrl
    }, 1);

    this.router.navigateByUrl('/cart');
  }

  onEdit() {
    this.edit.emit(this.product);
  }

  onRemove() {
    this.remove.emit(this.product.id);
  }
}

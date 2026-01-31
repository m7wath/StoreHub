import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

export interface ProductVm {
  id: number;
  name: string;
  price: number;

  // الجديد (بدل category)
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

  // Admin actions
  @Output() edit = new EventEmitter<ProductVm>();
  @Output() remove = new EventEmitter<number>();

  get isAdminMode(): boolean {
    return this.mode === 'admin';
  }

  onEdit() {
    this.edit.emit(this.product);
  }

  onRemove() {
    this.remove.emit(this.product.id);
  }
}

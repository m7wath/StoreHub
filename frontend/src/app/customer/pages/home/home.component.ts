import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductCardComponent, ProductVm } from '../../../shared/product-card/product-card.component';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, ProductCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
featured: ProductVm[] = Array.from({ length: 6 }).map((_, i) => {
  const id = i + 1;
  return {
    id,
    name: `Featured Product ${id}`,
    price: 120 + id * 25,
    categoryId: id % 2 === 0 ? 1 : 2,
    categoryName: id % 2 === 0 ? 'GPU' : 'CPU',
    imageUrl: `https://picsum.photos/seed/storehub-home-${id}/900/600`,
  };
});


  categories = [
    { title: 'Graphics Cards', key: 'GPU', icon: '🎮' },
    { title: 'Processors', key: 'CPU', icon: '⚙️' },
    { title: 'Memory', key: 'RAM', icon: '🧠' },
    { title: 'Storage', key: 'SSD', icon: '💾' },
    { title: 'Monitors', key: 'Monitor', icon: '🖥️' },
    { title: 'Keyboards', key: 'Keyboard', icon: '⌨️' },
  ];
}

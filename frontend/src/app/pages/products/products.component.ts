import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

type Product = {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
};

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  imports : [RouterLink]
})
export class ProductsComponent {
  products: Product[] = [
    { id: 1, name: 'RTX 4060 Ti', price: 429, imageUrl: 'https://picsum.photos/seed/gpu/800/600' },
    { id: 2, name: 'Ryzen 7 7800X3D', price: 389, imageUrl: 'https://picsum.photos/seed/cpu/800/600' },
    { id: 3, name: '1TB NVMe Gen4', price: 89, imageUrl: 'https://picsum.photos/seed/ssd/800/600' },
    { id: 4, name: '750W Gold PSU', price: 119, imageUrl: 'https://picsum.photos/seed/psu/800/600' },
  ];
}

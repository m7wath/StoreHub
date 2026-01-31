import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { ProductsApiService } from '../../../Services/products-api.service';
import { ProductApi } from '../../../Models/product-api.model';

type ProductDetailsVm = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  categoryName: string;
  imageUrl: string;
  description: string;
};

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css',
})
export class ProductDetailsComponent implements OnInit {
  product?: ProductDetailsVm;
  loading = false;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private productsApi: ProductsApiService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.error = 'Invalid product id';
      return;
    }

    this.loading = true;

    this.productsApi.getById(id).subscribe({
      next: (p: ProductApi) => {
        this.product = {
          id: p.id,
          name: p.name,
          price: p.price,
          quantity: p.quantity ?? 0,
          categoryName: p.category?.name ?? 'Unknown',
          imageUrl:
            p.imageUrl ??
            `https://picsum.photos/seed/storehub-${p.id}/900/600`,
          description:
            p.description ?? 'No description available.',
        };

        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Failed to load product details';
        this.loading = false;
      },
    });
  }

  back(): void {
    this.location.back();
  }
}

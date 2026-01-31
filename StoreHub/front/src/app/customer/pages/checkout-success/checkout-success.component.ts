import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OrdersLocalService, LocalOrder } from '../../../Services/orders-local.service';

@Component({
  selector: 'app-checkout-success',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './checkout-success.component.html',
})
export class CheckoutSuccessComponent implements OnInit {
  order?: LocalOrder;

  constructor(private route: ActivatedRoute, private orders: OrdersLocalService) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.order = this.orders.getById(id);
  }
}

import { Routes } from '@angular/router';

import { HomeComponent } from './customer/pages/home/home.component';
import { ProductsComponent } from './customer/pages/products/products.component';
import { ProductDetailsComponent } from './customer/pages/product-details/product-details.component';
import { CartComponent } from './customer/pages/cart/cart.component';
import { LoginComponent } from './customer/pages/login/login.component';
import { CheckoutComponent } from './customer/pages/checkout/checkout.component';
import { CheckoutSuccessComponent } from './customer/pages/checkout-success/checkout-success.component';

import { DashboardComponent } from './admin/pages/dashboard/dashboard.component';
import { ProductsManagementComponent } from './admin/pages/products-management/products-management.component';
import { OrdersManagementComponent } from './admin/pages/orders-management/orders-management.component';
import { CategoriesManagementComponent } from './admin/pages/categories-management/categories-management.component';
import { adminGuard } from './core/guards/admin.guard';
import { ProfileComponent } from './customer/pages/profile/profile.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'products/:id', component: ProductDetailsComponent },
  { path: 'cart', component: CartComponent },
  { path: 'login', component: LoginComponent },

{ path: 'admin/dashboard', component: DashboardComponent, canActivate: [adminGuard] },
{ path: 'admin/products', component: ProductsManagementComponent, canActivate: [adminGuard] },
{ path: 'admin/orders', component: OrdersManagementComponent, canActivate: [adminGuard] },
{ path: 'admin/categories', component: CategoriesManagementComponent, canActivate: [adminGuard] },
{
  path: 'admin/users',
  loadComponent: () => import('./admin/pages/users-management/users-management.component')
    .then(m => m.UsersManagementComponent),
  canActivate: [adminGuard]
},
{ path: 'checkout', component: CheckoutComponent },
{ path: 'checkout/success/:id', component: CheckoutSuccessComponent },
{ path: 'profile', component: ProfileComponent },

  { path: '**', redirectTo: '' },
];

import { Routes } from '@angular/router';

// CUSTOMER
import { HomeComponent } from './customer/pages/home/home.component';
import { ProductsComponent } from './customer/pages/products/products.component';
import { ProductDetailsComponent } from './customer/pages/product-details/product-details.component';
import { CartComponent } from './customer/pages/cart/cart.component';
import { LoginComponent } from './customer/pages/login/login.component';

// ADMIN
import { DashboardComponent } from './admin/pages/dashboard/dashboard.component';
import { ProductsManagementComponent } from './admin/pages/products-management/products-management.component';
import { OrdersManagementComponent } from './admin/pages/orders-management/orders-management.component';
import { CategoriesManagementComponent } from './admin/pages/categories-management/categories-management.component';

export const routes: Routes = [
  // ===== Customer Routes =====
  { path: '', component: HomeComponent },                 // /
  { path: 'products', component: ProductsComponent },     // /products
  { path: 'products/:id', component: ProductDetailsComponent }, // /products/5
  { path: 'cart', component: CartComponent },             // /cart
  { path: 'login', component: LoginComponent },           // /login

  // ===== Admin Routes =====
  { path: 'admin', redirectTo: 'admin/dashboard', pathMatch: 'full' }, // /admin -> dashboard
  { path: 'admin/dashboard', component: DashboardComponent },          // /admin/dashboard
  { path: 'admin/products', component: ProductsManagementComponent },  // /admin/products
  { path: 'admin/orders', component: OrdersManagementComponent },      // /admin/orders
  { path: 'admin/categories', component: CategoriesManagementComponent }, // /admin/categories

  { path: '**', redirectTo: '' }
];

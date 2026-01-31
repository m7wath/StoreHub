import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';

import { ProductsApiService } from '../../../Services/products-api.service';
import { CategoriesApiService } from '../../../Services/categories-api.service';

import { ProductApi } from '../../../Models/product-api.model';
import { CategoryApi } from '../../../Models/category-api.model';

type Mode = 'none' | 'add' | 'edit';

type AdminProductVm = {
  id: number;
  name: string;
  description?: string | null;
  price: number;
  quantity: number;
  categoryId: number | null;
  categoryName: string;
  imageUrl: string;
  createdAt?: string; // optional
};

type ProductForm = {
  id: number | null;
  name: string;
  description: string;
  price: number;
  quantity: number;
  categoryId: number | null; // only used in ADD (حسب الباك الحالي)
  imageUrl: string; // only used in ADD لو DTO عندك يدعمه، وإلا تجاهله
};

@Component({
  selector: 'app-products-management',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPaginationModule],
  templateUrl: './products-management.component.html',
  styleUrl: './products-management.component.css',
})
export class ProductsManagementComponent implements OnInit {
  // table + filters
  page = 1;
  pageSize = 10;

  search = '';
  selectedCategoryId: number | 'all' = 'all';

  loading = false;
  error = '';

  products: AdminProductVm[] = [];
  categories: CategoryApi[] = [];

  // form state
  mode: Mode = 'none';
  saving = false;

  form: ProductForm = this.emptyForm();

  constructor(
    private productsApi: ProductsApiService,
    private categoriesApi: CategoriesApiService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
  }

  // -------------------------
  // Loaders
  // -------------------------
  loadCategories() {
    this.categoriesApi.getList('', 1, 1000).subscribe({
      next: (res) => (this.categories = res ?? []),
      error: () => console.log('Failed to load categories'),
    });
  }

  loadProducts() {
    this.loading = true;
    this.error = '';

    // نجيب كمية كبيرة مرة وحدة وبنعمل فلترة/صفحات بالفرونت (حاليًا)
    this.productsApi.getList('', 1, 2000).subscribe({
      next: (res) => {
        const list = (res ?? []).map((p: ProductApi) => this.toVm(p));
        this.products = list;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load products (Admin).';
        this.loading = false;
      },
    });
  }

  private toVm(p: ProductApi): AdminProductVm {
    return {
      id: p.id,
      name: p.name,
      description: p.description ?? '',
      price: p.price,
      quantity: p.quantity ?? 0,
      categoryId: p.categoryId ?? null,
      categoryName: p.category?.name ?? 'Unknown',
      imageUrl:
        p.imageUrl ??
        `https://picsum.photos/seed/storehub-admin-${p.id}/800/500`,
      createdAt: (p as any).createdAt ? String((p as any).createdAt) : undefined,
    };
  }

  // -------------------------
  // Filters / Helpers
  // -------------------------
  resetPage() {
    this.page = 1;
  }

  get filtered(): AdminProductVm[] {
    let list = [...this.products];

    const q = this.search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.id.toString().includes(q) ||
          p.categoryName.toLowerCase().includes(q)
      );
    }

    if (this.selectedCategoryId !== 'all') {
      const cid = Number(this.selectedCategoryId);
      list = list.filter((p) => p.categoryId === cid);
    }

    // sort optional later
    return list;
  }

  // -------------------------
  // Form (Add/Edit)
  // -------------------------
  addNew() {
    this.mode = 'add';
    this.form = this.emptyForm();

    // لو عندك Categories، اختار أول واحدة افتراضيًا
    if (this.categories.length > 0) {
      this.form.categoryId = this.categories[0].id;
    }
  }

  edit(p: AdminProductVm) {
    this.mode = 'edit';
    this.form = {
      id: p.id,
      name: p.name,
      description: p.description ?? '',
      price: p.price,
      quantity: p.quantity,
      categoryId: p.categoryId, // بالباك الحالي Update ما بتستقبلها، بس نعرضها readonly
      imageUrl: p.imageUrl,
    };
  }

  cancel() {
    this.mode = 'none';
    this.form = this.emptyForm();
  }

  private emptyForm(): ProductForm {
    return {
      id: null,
      name: '',
      description: '',
      price: 0,
      quantity: 0,
      categoryId: null,
      imageUrl: '',
    };
  }

  // -------------------------
  // CRUD Calls
  // -------------------------
  save() {
    if (!this.form.name.trim()) {
      alert('Name is required');
      return;
    }
    if (this.form.price < 0) {
      alert('Price must be >= 0');
      return;
    }
    if (this.form.quantity < 0) {
      alert('Quantity must be >= 0');
      return;
    }

    this.saving = true;

    if (this.mode === 'add') {
      // ✅ CreateProductDto حسب صورك: Name/Description/Price/Quantity/CategoryId
      const dto: any = {
        name: this.form.name.trim(),
        description: this.form.description?.trim() ?? '',
        price: this.form.price,
        quantity: this.form.quantity,
        categoryId: this.form.categoryId,
      };

      // لو أنت فعلًا أضفت imageUrl بالباك (واضح من تجربتك)، اتركه:
      if (this.form.imageUrl?.trim()) dto.imageUrl = this.form.imageUrl.trim();

      this.productsApi.create(dto).subscribe({
        next: () => {
          this.saving = false;
          this.cancel();
          this.loadProducts();
        },
        error: () => {
          this.saving = false;
          alert('Failed to add product');
        },
      });

      return;
    }

    if (this.mode === 'edit' && this.form.id != null) {
  const dto: any = {
    name: this.form.name.trim(),
    description: this.form.description?.trim() ?? '',
    price: this.form.price,
    quantity: this.form.quantity,
    categoryId: this.form.categoryId,
    imageUrl: this.form.imageUrl?.trim() ?? null,
  };

  this.productsApi.update(this.form.id, dto).subscribe({
    next: () => {
      this.saving = false;
      this.cancel();
      this.loadProducts();
    },
    error: () => {
      this.saving = false;
      alert('Failed to update product');
    },
  });

  return;
}

    this.saving = false;
  }

  remove(p: AdminProductVm) {
    const ok = confirm(`Delete product #${p.id} (${p.name}) ?`);
    if (!ok) return;

    this.productsApi.delete(p.id).subscribe({
      next: () => this.loadProducts(),
      error: () => alert('Failed to delete'),
    });
  }

  // helper
  getCategoryNameById(id: number | null): string {
    if (!id) return 'Unknown';
    return this.categories.find((c) => c.id === id)?.name ?? 'Unknown';
  }
}

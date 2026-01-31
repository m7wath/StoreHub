import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { CategoriesApiService } from '../../../Services/categories-api.service';
import { CategoryApi } from '../../../Models/category-api.model';

type AdminCategoryVm = {
  id: number;
  name: string;
  type: string;
  productsCount: number;
  status: 'Active' | 'Hidden';
  createdAt: string;
};

@Component({
  selector: 'app-categories-management',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPaginationModule],
  templateUrl: './categories-management.component.html',
  styleUrl: './categories-management.component.css',
})
export class CategoriesManagementComponent {
  search = '';
  page = 1;
  pageSize = 10;

  loading = false;
  error = '';
  editingId: number | null = null;

editModel = {
  name: '',
  description: '',
  parentCategoryId: null as number | null
};


  categories: CategoryApi[] = [];


  showAdd = false;
  newCategory = {
    name: '',
    description: '',
    parentCategoryId: null as number | null,
  };

  constructor(private categoriesApi: CategoriesApiService) { }

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.loading = true;
    this.error = '';

    this.categoriesApi.getList(this.search, 1, 1000).subscribe({
      next: (res) => {
        this.categories = res ?? [];
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Failed to load categories';
        this.loading = false;
      },
    });
  }

  resetPage() {
    this.page = 1;
  }

  onSearchChange() {
    this.resetPage();
    this.loadCategories();
  }


  openAdd() {
    this.showAdd = true;
  }

  closeAdd() {
    this.showAdd = false;
    this.newCategory = { name: '', description: '', parentCategoryId: null };
  }

  addCategory() {
    const name = this.newCategory.name.trim();
    if (!name) {
      alert('Name is required');
      return;
    }

    this.categoriesApi.create({
      name,
      description: this.newCategory.description?.trim() || null,
      parentCategoryId: this.newCategory.parentCategoryId,
    }).subscribe({
      next: () => {
        this.closeAdd();
        this.loadCategories();
      },
      error: (err) => {
        console.error(err);
        alert(err?.error?.message ?? 'Create failed');
      },
    });
  }

  remove(c: CategoryApi) {
    const ok = confirm(`Delete category #${c.id}?`);
    if (!ok) return;

    this.categoriesApi.delete(c.id).subscribe({
      next: () => this.loadCategories(),
      error: (err) => {
        console.error(err);
        const msg = typeof err?.error === 'string'
          ? err.error
          : (err?.error?.message ?? 'Delete failed');

        alert(msg);

      },
    });
  }

  startEdit(c: any) {
  this.editingId = c.id;
  this.editModel = {
    name: c.name ?? '',
    description: c.description ?? '',
    parentCategoryId: c.parentCategoryId ?? null
  };
}

cancelEdit() {
  this.editingId = null;
  this.editModel = { name: '', description: '', parentCategoryId: null };
}

saveEdit(id: number) {
  const name = this.editModel.name.trim();
  if (!name) {
    alert('Name is required');
    return;
  }

  const dto = {
    name,
    description: this.editModel.description?.trim() || null,
    parentCategoryId: this.editModel.parentCategoryId
  };

  this.categoriesApi.update(id, dto).subscribe({
    next: () => {
      this.cancelEdit();
      this.loadCategories();
    },
    error: (err) => {
      console.error(err);
      const msg = typeof err?.error === 'string'
        ? err.error
        : (err?.error?.message ?? 'Update failed');
      alert(msg);
    }
  });
}

}

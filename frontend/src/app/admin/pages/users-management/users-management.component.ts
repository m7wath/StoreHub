import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';

import { UsersApiService, UserApi } from '../../../Services/users-api.service';

type Mode = 'none' | 'edit' | 'reset';

type UserVm = {
  id: number;
  fullName: string;
  email: string;
  role: string;
  createdAt: string;
};

type EditForm = {
  id: number | null;
  fullName: string;
  email: string;
  role: string;
};

type ResetForm = {
  id: number | null;
  fullName: string;
  newPassword: string;
  confirmPassword: string;
};

@Component({
  selector: 'app-users-management',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPaginationModule],
  templateUrl: './users-management.component.html',
  styleUrl: './users-management.component.css',
})
export class UsersManagementComponent implements OnInit {
  page = 1;
  pageSize = 10;

  search = '';

  loading = false;
  error = '';

  users: UserVm[] = [];
  mode: Mode = 'none';
  saving = false;

  editForm: EditForm = this.emptyEditForm();
  resetForm: ResetForm = this.emptyResetForm();

  roles = ['Admin', 'Customer'];

  constructor(private usersApi: UsersApiService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.error = '';

    this.usersApi.getList(1, 2000).subscribe({
      next: (res) => {
        this.users = (res ?? []).map((u) => this.toVm(u));
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load users.';
        this.loading = false;
      },
    });
  }

  private toVm(u: UserApi): UserVm {
    return {
      id: u.id,
      fullName: u.fullName,
      email: u.email,
      role: u.role,
      createdAt: u.createdAt,
    };
  }

  resetPage() {
    this.page = 1;
  }

  get filtered(): UserVm[] {
    let list = [...this.users];

    const q = this.search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (u) =>
          u.fullName.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.role.toLowerCase().includes(q) ||
          u.id.toString().includes(q)
      );
    }

    return list;
  }

  openEdit(u: UserVm) {
    this.mode = 'edit';
    this.editForm = {
      id: u.id,
      fullName: u.fullName,
      email: u.email,
      role: u.role,
    };
  }

  openReset(u: UserVm) {
    this.mode = 'reset';
    this.resetForm = {
      id: u.id,
      fullName: u.fullName,
      newPassword: '',
      confirmPassword: '',
    };
  }

  closeModal() {
    this.mode = 'none';
    this.saving = false;
    this.editForm = this.emptyEditForm();
    this.resetForm = this.emptyResetForm();
  }

  private emptyEditForm(): EditForm {
    return { id: null, fullName: '', email: '', role: 'Customer' };
  }

  private emptyResetForm(): ResetForm {
    return { id: null, fullName: '', newPassword: '', confirmPassword: '' };
  }

  saveEdit() {
    if (this.editForm.id == null) return;

    if (!this.editForm.email.trim()) {
      alert('Email is required');
      return;
    }

    this.saving = true;

    this.usersApi
      .update(this.editForm.id, {
        email: this.editForm.email.trim(),
        role: this.editForm.role.trim(),
      })
      .subscribe({
        next: () => {
          this.saving = false;
          this.closeModal();
          this.loadUsers();
        },
        error: () => {
          this.saving = false;
          alert('Failed to update user');
        },
      });
  }

  saveReset() {
    if (this.resetForm.id == null) return;

    const p1 = this.resetForm.newPassword;
    const p2 = this.resetForm.confirmPassword;

    if (!p1 || p1.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }
    if (p1 !== p2) {
      alert('Passwords do not match');
      return;
    }

    this.saving = true;

    this.usersApi.resetPassword(this.resetForm.id, { newPassword: p1 }).subscribe({
      next: () => {
        this.saving = false;
        this.closeModal();
        alert('Password updated');
      },
      error: () => {
        this.saving = false;
        alert('Failed to reset password');
      },
    });
  }

  remove(u: UserVm) {
    const ok = confirm(`Delete user #${u.id} (${u.fullName}) ?`);
    if (!ok) return;

    this.usersApi.delete(u.id).subscribe({
      next: () => this.loadUsers(),
      error: () => alert('Failed to delete user'),
    });
  }

  formatDate(iso: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleString(); 
}

}

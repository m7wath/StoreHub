import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../core/api.config';

export interface AdminDashboardStats {
  products: number;
  orders: number;
  categories: number;
  users: number;
}

@Injectable({ providedIn: 'root' })
export class AdminApiService {
  private url = `${API_BASE_URL}/api/admin/dashboard`;

  constructor(private http: HttpClient) {}

  getStats(): Observable<AdminDashboardStats> {
    return this.http.get<AdminDashboardStats>(`${this.url}/stats`);
  }
}

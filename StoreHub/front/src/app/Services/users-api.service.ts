import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../core/api.config';

export type UserApi = {
  id: number;
  fullName: string;
  email: string;
  role: string;
  createdAt: string;
};

@Injectable({ providedIn: 'root' })
export class UsersApiService {
  private baseUrl = `${API_BASE_URL}/api/User`;

  constructor(private http: HttpClient) {}

  getList(pageNumber = 1, pageSize = 10): Observable<UserApi[]> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber)
      .set('pageSize', pageSize);

    return this.http.get<UserApi[]>(this.baseUrl, { params });
  }

  update(id: number, dto: { email: string; role: string }) {
    return this.http.put(`${this.baseUrl}/${id}`, dto);
  }

  resetPassword(id: number, dto: { newPassword: string }) {
    return this.http.put(`${this.baseUrl}/${id}/reset-password`, dto);
  }

  delete(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}

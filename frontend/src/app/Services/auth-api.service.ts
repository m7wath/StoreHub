import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../core/api.config';
import { Observable } from 'rxjs';

export type LoginRequest = { email: string; password: string };
export type LoginResponse = { token: string; expiresAtUtc: string };

@Injectable({ providedIn: 'root' })
export class AuthApiService {
  private url = `${API_BASE_URL}/api/Auth`;

  constructor(private http: HttpClient) {}

  login(dto: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.url}/login`, dto);
  }
}

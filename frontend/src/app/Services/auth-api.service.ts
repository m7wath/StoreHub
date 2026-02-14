import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../core/api.config';
import { Observable, tap } from 'rxjs';

export type LoginRequest = { email: string; password: string };
export type LoginResponse = { token: string; expiresAtUtc: string };

export type RegisterRequest = { name: string; email: string; password: string };
export type RegisterResponse = { message: string };

@Injectable({ providedIn: 'root' })
export class AuthApiService {
  private url = `${API_BASE_URL}/api/auth`;

  constructor(private http: HttpClient) {}

  register(dto: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.url}/register`, dto);
  }

  login(dto: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.url}/login`, dto)
      .pipe(
        tap((res) => {
          localStorage.setItem('token', res.token);
          localStorage.setItem('expiresAtUtc', res.expiresAtUtc);
        })
      );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiresAtUtc');
  }

  get token(): string | null {
    return localStorage.getItem('token');
  }

  get isLoggedIn(): boolean {
    return !!this.token;
  }
}

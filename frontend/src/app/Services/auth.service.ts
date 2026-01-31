import { Injectable } from '@angular/core';

type JwtPayload = {
  role?: string;
  [key: string]: any;
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenKey = 'storehub_token';
  private expKey = 'storehub_exp';

  saveAuth(token: string, expiresAtUtc: string) {
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.expKey, expiresAtUtc);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.expKey);
  }

  isAdmin(): boolean {
    const role = this.getRole();
    return role?.toLowerCase() === 'admin';
  }

  getRole(): string | null {
    const payload = this.getPayload();
    return (
      payload?.role ??
      payload?.['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ??
      null
    );
  }

  private getPayload(): JwtPayload | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const part = token.split('.')[1];
      const json = atob(part.replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(json);
    } catch {
      return null;
    }
  }
}

import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

type JwtPayload = {
  role?: string;
  exp?: number;
  [key: string]: any;
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenKey = 'storehub_token';
  private expKey = 'storehub_exp';

  private isBrowser: boolean;

  private authStateSubject: BehaviorSubject<boolean>;
  authState$;

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);

    const initial = this.isBrowser ? this.computeLoggedIn() : false;
    this.authStateSubject = new BehaviorSubject<boolean>(initial);
    this.authState$ = this.authStateSubject.asObservable();
  }

  saveAuth(token: string, expiresAtUtc: string) {
    if (!this.isBrowser) return;

    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.expKey, expiresAtUtc);

    this.authStateSubject.next(this.computeLoggedIn());
  }

  getToken(): string | null {
    if (!this.isBrowser) return null;
    return localStorage.getItem(this.tokenKey);
  }

  getExpires(): string | null {
    if (!this.isBrowser) return null;
    return localStorage.getItem(this.expKey);
  }

  get isLoggedIn(): boolean {
    if (!this.isBrowser) return false;
    return this.computeLoggedIn();
  }

  logout() {
    if (!this.isBrowser) return;

    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.expKey);

    this.authStateSubject.next(false);
  }

  get isAdmin(): boolean {
    if (!this.isLoggedIn) return false;

    const role = this.getRole();
    return role?.toLowerCase() === 'admin';
  }

  getRole(): string | null {
    const payload = this.getPayload();
    if (!payload) return null;

    return (
      payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ??
      payload['role'] ??
      payload['Role'] ??
      null
    );
  }

  private getPayload(): JwtPayload | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const part = token.split('.')[1];
      if (!part) return null;

      const json = atob(part.replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(json);
    } catch {
      return null;
    }
  }

  private computeLoggedIn(): boolean {
    const token = this.getToken();
    const expires = this.getExpires();

    if (!token || !expires) return false;

    const expTime = new Date(expires).getTime();

    if (Number.isNaN(expTime)) {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.expKey);
      return false;
    }

    if (Date.now() >= expTime) {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.expKey);
      return false;
    }

    return true;
  }

getUserName(): string | null {
  const payload = this.getPayload();
  if (!payload) return null;

  return (
    payload['Name'] ?? 
    payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] ??
    payload['unique_name'] ??
    payload['name'] ??
    payload['given_name'] ??
    payload['email'] ??
    null
  );
}
}

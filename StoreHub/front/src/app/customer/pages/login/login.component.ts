import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthApiService } from '../../../Services/auth-api.service';
import { AuthService } from '../../../Services/auth.service';

type LoginDto = {
  email: string;
  password: string;
};

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  email = '';
  password = '';
  showPassword = false;

  loading = false;
  error = '';

  constructor(
    private authApi: AuthApiService,
    public auth: AuthService,
    private router: Router
  ) {}

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  login(): void {
    if (this.loading) return;

    this.error = '';

    const email = this.email.trim().toLowerCase();
    const password = this.password; // (إذا بدك trim: this.password.trim())

    if (!email || !password.trim()) {
      this.error = 'Please enter email and password.';
      return;
    }

    this.loading = true;

    const dto: LoginDto = { email, password };

    this.authApi.login(dto).subscribe({
  next: (res: any) => {
    this.loading = false;

    this.auth.saveAuth(res.token, res.expiresAtUtc);

    if (this.auth.isAdmin) this.router.navigateByUrl('/admin/dashboard');
    else this.router.navigateByUrl('/');
  },
  error: (err: any) => {
    this.loading = false;

    if (err?.status === 401) {
      this.error = err?.error?.message ?? 'Invalid email or password.';
      return;
    }

    this.error = err?.error?.message ?? 'Login failed. Please try again.';
  },
});
  }
}

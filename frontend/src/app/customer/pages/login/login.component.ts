import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthApiService } from '../../../Services/auth-api.service';
import { AuthService } from '../../../Services/auth.service';

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
    private auth: AuthService,
    private router: Router
  ) {}

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  login(): void {
    this.error = '';
    console.log('login fired');
    if (!this.email.trim() || !this.password.trim()) {
      this.error = 'Please enter email and password.';
      return;
    }

    this.loading = true;

    const dto = {
      email: this.email.trim(),
      password: this.password,
    };

    this.authApi.login(dto).subscribe({
      next: (res) => {
        this.loading = false;

        this.auth.saveAuth(res.token, res.expiresAtUtc);

        // Admin -> dashboard
        if (this.auth.isAdmin()) this.router.navigateByUrl('/admin');
        else this.router.navigateByUrl('/');
      },
      error: (err) => {
        this.loading = false;
        this.error =
          err?.error?.message ||
          'Login failed. Please check your email/password.';
      },
    });
  }
}

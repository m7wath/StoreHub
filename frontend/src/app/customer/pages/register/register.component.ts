import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthApiService } from '../../../Services/auth-api.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  fullName = '';
  email = '';
  password = '';

  loading = false;
  error = '';
  success = '';

  constructor(private authApi: AuthApiService, private router: Router) {}

  register() {
    this.error = '';
    this.success = '';
    this.loading = true;

    this.authApi.register({
      name: this.fullName,
      email: this.email,
      password: this.password,
    }).subscribe({
      next: () => {
        this.loading = false;
        this.success = 'Registered successfully. You can login now.';
        setTimeout(() => this.router.navigate(['/login']), 600);
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || 'Register failed';
      }
    });
  }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthApiService } from '../../../../Services/auth-api.service';
import { AuthService } from '../../../../Services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loading = false;
  error = '';

  form!: FormGroup; // ✅ مهم

  constructor(
    private fb: FormBuilder,
    private authApi: AuthApiService,
    private auth: AuthService,
    private router: Router
  ) {
    // ✅ أنشئ الفورم هون
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]],
    });
  }

  submit() {
    this.error = '';
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;

    const dto = {
      email: this.form.value.email!.trim(),
      password: this.form.value.password!,
    };

    this.authApi.login(dto).subscribe({
      next: (res) => {
        this.loading = false;
        this.auth.saveAuth(res.token, res.expiresAtUtc);

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

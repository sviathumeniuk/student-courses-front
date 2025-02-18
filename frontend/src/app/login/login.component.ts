import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';  // Імпортуємо Router

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(private readonly fb: FormBuilder, private readonly http: HttpClient, private readonly router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onLoginSuccess(): void {
    this.router.navigate(['/teachers']);
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      this.http.post('http://localhost:5000/api/auth/login', { email, password })
        .subscribe({
          next: (response: any) => {
            if (response?.token) {
              localStorage.setItem('token', response.token);
              console.log('JWT Token saved in localStorage:', response.token);
              this.successMessage = 'Ви успішно увійшли!';
              this.errorMessage = null;
              this.onLoginSuccess();
            } else {
              this.errorMessage = 'Не вдалося отримати токен';
            }
          },
          error: (error) => {
            console.error('Login error:', error);
            this.errorMessage = 'Невірний email або пароль!';
            this.successMessage = null;
          }
        });
    } else {
      this.errorMessage = 'Будь ласка, виправте помилки у формі!';
    }
  }
}

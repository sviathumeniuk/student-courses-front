import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    // Ініціалізація форми з валідаторами
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],  // Перевірка на мінімум 3 символи для username
      email: ['', [Validators.required, Validators.email]],  // Перевірка на валідний email
      password: ['', [Validators.required, Validators.minLength(6)]],  // Мінімум 6 символів
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],  // Мінімум 6 символів
      role: ['', [Validators.required]],  // Роль обов'язкова
    }, {
      validators: this.passwordMatchValidator  // Перевірка, чи співпадають паролі
    });
  }

  // Перевірка, чи співпадають паролі
  passwordMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { 'passwordMismatch': true };
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const { username, email, password, role } = this.registerForm.value;

      // Відправка POST запиту на сервер для реєстрації користувача
      this.http.post('http://localhost:5000/api/auth/register', { username, email, password, role })
        .subscribe({
          next: (response: any) => {
            console.log('Registration response:', response);

            // Зберігаємо токен у локальне сховище
            if (response.token) {
              localStorage.setItem('token', response.token);
              console.log('Токен збережено в localStorage');
            }

            this.successMessage = 'Ви успішно зареєстровані!';
            this.errorMessage = null;
          },
          error: (error) => {
            console.error('Registration error:', error);
            this.errorMessage = 'Сталася помилка при реєстрації!';
            this.successMessage = null;
          }
        });
    } else {
      this.errorMessage = 'Будь ласка, виправте помилки у формі!';
    }
  }
}

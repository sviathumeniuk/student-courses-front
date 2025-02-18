// // auth.service.ts
// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';

// @Injectable({
//   providedIn: 'root',
// })
// export class AuthService {
//   private apiUrl = 'http://localhost:5000/api/auth/login';  // Заміни на ваш API

//   constructor(private http: HttpClient) {}

//   login(email: string, password: string): Observable<any> {
//     // Формуємо тіло запиту
//     const body = { email, password };
//     return this.http.post<any>(this.apiUrl, body);
//   }
// }

import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Payment } from '../models/payment.model';

@Injectable({
  providedIn: 'root',
})
export class PaymentsService {
  private readonly apiUrl = `${environment.apiUrl}${environment.endpoints.payments}`;

  constructor(private readonly http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getPayments(): Observable<Payment[]> {
    return this.http.get<Payment[]>(this.apiUrl, {
      headers: this.getHeaders(),
    });
  }

  getPaymentById(id: string): Observable<Payment> {
    return this.http.get<Payment>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders(),
    });
  }

  createPayment(payment: Omit<Payment, '_id'>): Observable<Payment> {
    return this.http.post<Payment>(this.apiUrl, payment, {
      headers: this.getHeaders(),
    });
  }

  updatePayment(id: string, payment: Partial<Payment>): Observable<Payment> {
    return this.http.put<Payment>(`${this.apiUrl}/${id}`, payment, {
      headers: this.getHeaders(),
    });
  }

  deletePayment(id: string): Observable<Payment> {
    return this.http.delete<Payment>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders(),
    });
  }
}

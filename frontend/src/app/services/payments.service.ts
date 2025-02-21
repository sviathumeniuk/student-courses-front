import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BaseService } from './base.service';
import { Payment } from '../models/payment.model';

@Injectable({
  providedIn: 'root'
})
export class PaymentsService extends BaseService<Payment> {
  constructor(http: HttpClient) {
    super(http, environment.endpoints.payments);
  }
}
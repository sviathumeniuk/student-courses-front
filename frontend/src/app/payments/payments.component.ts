import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

interface Payment {
  _id: string;
  teacher: string;
  amount: number;
  date: Date;
  paymentStatus: 'paid' | 'pending';
  paymentMethod: 'cash' | 'bank transfer';
  notes: string;
}

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  template: `
    <div class="container mx-auto p-4">
      <!-- Filters and Search -->
      <div class="mb-6 p-4 bg-white rounded-lg shadow-lg">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <!-- Payment ID Search -->
          <div class="form-group">
            <label class="block text-sm font-medium text-gray-700">Search by Payment ID</label>
            <div class="mt-1 flex rounded-md shadow-sm">
              <input 
                type="text" 
                [(ngModel)]="paymentIdSearch" 
                class="block w-full rounded-l-md border-gray-300"
                placeholder="Enter payment ID">
              <button 
                (click)="searchById()"
                class="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 hover:bg-gray-100">
                Search
              </button>
            </div>
          </div>

          <!-- Teacher Filter -->
          <div class="form-group">
            <label class="block text-sm font-medium text-gray-700">Filter by Teacher</label>
            <input 
              type="text" 
              [(ngModel)]="teacherFilter" 
              (keyup.enter)="filterByTeacher()"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              placeholder="Enter teacher ID">
          </div>

          <!-- Status Filter -->
          <div class="form-group">
            <label class="block text-sm font-medium text-gray-700">Filter by Status</label>
            <select 
              [(ngModel)]="statusFilter"
              (change)="filterByStatus()"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
              <option value="">All</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          <!-- Reset Filters -->
          <div class="form-group flex items-end">
            <button 
              (click)="resetFilters()"
              class="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 w-full">
              Reset All
            </button>
          </div>
        </div>
      </div>

      <!-- Payment Form -->
      <div class="mb-8 p-6 bg-white rounded-lg shadow-lg">
        <h2 class="text-2xl font-bold mb-6">Create Payment</h2>
        <form [formGroup]="paymentForm" (ngSubmit)="onSubmit()" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="form-group">
              <label class="block text-sm font-medium text-gray-700">Teacher ID</label>
              <input type="text" formControlName="teacher" 
                     class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
            </div>

            <div class="form-group">
              <label class="block text-sm font-medium text-gray-700">Amount</label>
              <input type="number" formControlName="amount" 
                     class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
            </div>

            <div class="form-group">
              <label class="block text-sm font-medium text-gray-700">Payment Status</label>
              <select formControlName="paymentStatus" 
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
              </select>
            </div>

            <div class="form-group">
              <label class="block text-sm font-medium text-gray-700">Payment Method</label>
              <select formControlName="paymentMethod" 
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                <option value="cash">Cash</option>
                <option value="bank transfer">Bank Transfer</option>
              </select>
            </div>

            <div class="form-group col-span-2">
              <label class="block text-sm font-medium text-gray-700">Notes</label>
              <textarea formControlName="notes" rows="3" 
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"></textarea>
            </div>
          </div>

          <div class="flex justify-end">
            <button type="submit" 
                    [disabled]="!paymentForm.valid"
                    class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 
                           focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 
                           disabled:opacity-50">
              {{ selectedPayment ? 'Update Payment' : 'Create Payment' }}
            </button>
          </div>
        </form>
      </div>

      <!-- Payments Table -->
      <div class="bg-white rounded-lg shadow-lg">
        <h2 class="text-2xl font-bold p-6 border-b">Payments List</h2>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Teacher</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Method</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Notes</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr *ngFor="let payment of payments">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{payment._id}}
                </td>
                <td class="px-6 py-4">{{payment.teacher}}</td>
                <td class="px-6 py-4">{{payment.amount | currency}}</td>
                <td class="px-6 py-4">{{payment.date | date:'short'}}</td>
                <td class="px-6 py-4">
                  <span [class]="payment.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'">
                    {{payment.paymentStatus}}
                  </span>
                </td>
                <td class="px-6 py-4">{{payment.paymentMethod}}</td>
                <td class="px-6 py-4">{{payment.notes}}</td>
                <td class="px-6 py-4 text-sm font-medium">
                  <button (click)="editPayment(payment)" 
                          class="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                  <button (click)="deletePayment(payment._id)" 
                          class="text-red-600 hover:text-red-900">Delete</button>
                </td>
              </tr>
              <tr *ngIf="payments.length === 0">
                <td colspan="8" class="px-6 py-4 text-center text-gray-500">
                  No payments found
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class PaymentComponent implements OnInit {
  paymentForm!: FormGroup;
  payments: Payment[] = [];
  selectedPayment: Payment | null = null;
  teacherFilter: string = '';
  statusFilter: string = '';
  paymentIdSearch: string = '';
  private apiUrl = 'http://localhost:5000/api/payments';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.initForm();
  }

  private initForm(payment: Payment | null = null): void {
    this.paymentForm = this.fb.group({
      teacher: [payment?.teacher || '', Validators.required],
      amount: [payment?.amount || '', [Validators.required, Validators.min(0)]],
      paymentStatus: [payment?.paymentStatus || 'pending', Validators.required],
      paymentMethod: [payment?.paymentMethod || '', Validators.required],
      notes: [payment?.notes || '']
    });
  }

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found in localStorage');
      return;
    }
    this.loadPayments();
  }

  private getHeaders() {
    const token = localStorage.getItem('token');
    return { 'Authorization': `Bearer ${token}` };
  }

  loadPayments(): void {
    this.http.get<Payment[]>(this.apiUrl, { headers: this.getHeaders() })
      .subscribe({
        next: (data) => this.payments = data,
        error: (error) => this.handleError('Error loading payments:', error)
      });
  }

  searchById(): void {
    if (!this.paymentIdSearch.trim()) {
      this.loadPayments();
      return;
    }

    this.http.get<Payment>(`${this.apiUrl}/${this.paymentIdSearch}`, { headers: this.getHeaders() })
      .subscribe({
        next: (payment) => {
          this.payments = [payment]; // Show only the found payment in the table
        },
        error: (error) => {
          if (error.status === 404) {
            this.payments = []; // Clear the table if payment not found
            console.error('Payment not found');
          } else {
            this.handleError('Error searching payment:', error);
          }
        }
      });
  }

  filterByTeacher(): void {
    if (!this.teacherFilter) {
      this.loadPayments();
      return;
    }

    this.http.get<Payment[]>(`${this.apiUrl}/teacher/${this.teacherFilter}`, { headers: this.getHeaders() })
      .subscribe({
        next: (data) => this.payments = data,
        error: (error) => this.handleError('Error filtering by teacher:', error)
      });
  }

  filterByStatus(): void {
    if (!this.statusFilter) {
      this.loadPayments();
      return;
    }

    this.http.get<Payment[]>(`${this.apiUrl}/status/${this.statusFilter}`, { headers: this.getHeaders() })
      .subscribe({
        next: (data) => this.payments = data,
        error: (error) => this.handleError('Error filtering by status:', error)
      });
  }

  resetFilters(): void {
    this.teacherFilter = '';
    this.statusFilter = '';
    this.paymentIdSearch = '';
    this.loadPayments();
  }

  onSubmit(): void {
    if (this.paymentForm.valid) {
      const paymentData = this.paymentForm.value;

      if (this.selectedPayment) {
        // Update existing payment
        this.http.put<Payment>(
          `${this.apiUrl}/${this.selectedPayment._id}`,
          paymentData,
          { headers: this.getHeaders() }
        ).subscribe({
          next: () => {
            this.loadPayments();
            this.resetForm();
          },
          error: (error) => this.handleError('Error updating payment:', error)
        });
      } else {
        // Create new payment
        this.http.post<Payment>(
          this.apiUrl,
          paymentData,
          { headers: this.getHeaders() }
        ).subscribe({
          next: () => {
            this.loadPayments();
            this.resetForm();
          },
          error: (error) => this.handleError('Error creating payment:', error)
        });
      }
    }
  }

  editPayment(payment: Payment): void {
    this.selectedPayment = payment;
    this.initForm(payment);
  }

  deletePayment(id: string): void {
    if (confirm('Are you sure you want to delete this payment?')) {
      this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
        .subscribe({
          next: () => this.loadPayments(),
          error: (error) => this.handleError('Error deleting payment:', error)
        });
    }
  }

  resetForm(): void {
    this.selectedPayment = null;
    this.initForm();
  }

  private handleError(message: string, error: any): void {
    console.error(message, error);
    if (error.status === 401) {
      console.error('Unauthorized access. Please login again.');
      // Handle unauthorized access (e.g., redirect to login)
    }
  }
}

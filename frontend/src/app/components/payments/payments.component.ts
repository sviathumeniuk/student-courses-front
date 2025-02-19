import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { Payment } from "../../models/payment.model";
import { PaymentsService } from "../../services/payments.service";

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css']
})
export class PaymentComponent implements OnInit {
  paymentForm!: FormGroup;
  payments: Payment[] = [];
  selectedPayment: Payment | null = null;
  teacherFilter: string = '';
  statusFilter: string = '';
  paymentIdSearch: string = '';

  constructor(
    private fb: FormBuilder,
    private paymentService: PaymentsService
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
    if (!localStorage.getItem('token')) {
      console.error('No token found in localStorage');
      return;
    }
    this.loadPayments();
  }

  loadPayments(): void {
    this.paymentService.getPayments().subscribe({
      next: (data: Payment[]) => this.payments = data,
      error: (error: any) => this.handleError('Error loading payments:', error)
    });
  }

  searchById(): void {
    if (!this.paymentIdSearch.trim()) {
      this.loadPayments();
      return;
    }

    this.paymentService.getPaymentById(this.paymentIdSearch).subscribe({
      next: (payment: any) => {
        this.payments = [payment];
      },
      error: (error: { status: number; }) => {
        if (error.status === 404) {
          this.payments = [];
          console.error('Payment not found');
        } else {
          this.handleError('Error searching payment:', error);
        }
      }
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
        this.paymentService.updatePayment(this.selectedPayment._id, paymentData).subscribe({
          next: () => {
            this.loadPayments();
            this.resetForm();
          },
          error: (error: any) => this.handleError('Error updating payment:', error)
        });
      } else {
        this.paymentService.createPayment(paymentData).subscribe({
          next: () => {
            this.loadPayments();
            this.resetForm();
          },
          error: (error: any) => this.handleError('Error creating payment:', error)
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
      this.paymentService.deletePayment(id).subscribe({
        next: () => this.loadPayments(),
        error: (error: any) => this.handleError('Error deleting payment:', error)
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
    }
  }
}
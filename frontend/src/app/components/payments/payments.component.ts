import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Payment } from "../../models/payment.model";
import { PaymentsService } from "../../services/payments.service";

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
  ],
  providers: [
    PaymentsService
  ],
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css']
})
export class PaymentComponent implements OnInit {
  payments: Payment[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';
  isEditing: boolean = false;
  selectedPayment: Payment | null = null;
  formData: Partial<Payment> = {
    amount: 0,
    paymentStatus: 'pending',
    paymentMethod: 'cash' as 'cash' | 'bank transfer',
    teacher: '',
    notes: ''
  }

  constructor(private readonly paymentService: PaymentsService) {}

  ngOnInit(): void {
    this.loadPayments();
  }

  resetForm(): void {
    this.formData = { amount: 0, paymentStatus: 'pending', paymentMethod: undefined, teacher: '', notes: '' };
  }

  loadPayments(): void {
    this.isLoading = true;
    this.paymentService.getAll().subscribe({
      next: (data: Payment[]) => {
        this.payments = data;
        this.isLoading = false;
      },
      error: (errorMessage) => console.error('Error fetching payments:', errorMessage)
    });
  }

  createPayment(): void {
    this.paymentService.create(this.formData as Omit<Payment, '_id'>).subscribe({
      next: (payment: Payment) => {
        this.payments.push(payment);
        this.resetForm();
      },
      error: (errorMessage) => console.error('Error creating payment:', errorMessage)
    });
  }

  updatePayment(): void {
    if (this.selectedPayment?._id) {
      this.paymentService.update(this.selectedPayment._id, this.formData).subscribe({
        next: (updatePayment: Payment) => {
          const index = this.payments.findIndex(p => p._id === updatePayment._id);
          if (index !== -1) {
            this.payments[index] = updatePayment;
          }
          this.cancelEdit();
          this.errorMessage = '';
        },
        error: (errorMessage) => console.error('Error updating payment:', errorMessage)
      });
    }
  }

  editPayment(payment: Payment): void {
    this.selectedPayment = payment;
    this.isEditing = true;
    this.formData = { ...payment };
  }

  deletePayment(id: string): void {
    if (confirm('Are you sure you want to delete this payment?')) {
      this.paymentService.delete(id).subscribe({
        next: () => {
          this.payments = this.payments.filter(p => p._id !== id);
          this.errorMessage = '';
        },
        error: (errorMessage) => console.error('Error deleting payment:', errorMessage)
      });
    }
  }

  cancelEdit(): void {
    this.selectedPayment = null;
    this.isEditing = false;
    this.resetForm();
  }
}
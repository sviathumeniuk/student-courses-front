import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Payment } from "../../models/payment.model";
import { PaymentsService } from "../../services/payments.service";
import { BaseComponent } from "../base/base.component";

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
export class PaymentComponent extends BaseComponent<Payment> {
  override formData: Partial<Payment> = {
    teacher: '',
    amount: 0,
    paymentStatus: '',
    paymentMethod: '',
    notes: ''
  };

  constructor(private readonly paymentService: PaymentsService) {
    super();
    this.entityService = paymentService;
  }

  override resetForm(): void {
    this.formData = {
      teacher: '',
      amount: 0,
      paymentStatus: '',
      paymentMethod: '',
      notes: ''
    };
  }
}
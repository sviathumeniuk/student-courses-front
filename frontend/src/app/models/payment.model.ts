import { Entity } from "./entity.model";
export interface Payment extends Entity {
    teacher: string;
    amount: number;
    date: Date;
    paymentStatus: 'paid' | 'pending';
    paymentMethod: 'cash' | 'bank transfer';
    notes: string;
  }
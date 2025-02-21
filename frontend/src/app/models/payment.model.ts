import { Entity } from "./entity.model";
export interface Payment extends Entity {
    teacher: string;
    amount: number;
    date: Date;
    paymentStatus: '';
    paymentMethod: '';
    notes: string;
  }
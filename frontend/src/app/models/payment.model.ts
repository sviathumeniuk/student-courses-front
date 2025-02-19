export interface Payment {
    _id: string;
    teacher: string;
    amount: number;
    date: Date;
    paymentStatus: 'paid' | 'pending';
    paymentMethod: 'cash' | 'bank transfer';
    notes: string;
  }
import { Payment } from '../types/Payment';

export class PaymentResponseDto {
  id: string;
  amount: number;
  currency: string;
  status: string;
  method: string;
  clientId: string;
  sessionId?: string;
  dueDate?: Date;
  createdAt: Date;

  static fromDomain(payment: Payment): PaymentResponseDto {
    return {
      id: payment.id.value,
      amount: payment.amount,
      currency: payment.currency,
      status: payment.status,
      method: payment.method,
      clientId: payment.clientId,
      sessionId: payment.sessionId,
      dueDate: payment.dueDate,
      createdAt: payment.createdAt,
    };
  }
} 
import { Payment } from "../types/Payment";

export class PaymentResponseDto {
  id!: string;
  amount!: number;
  status!: string;
  currency!: string;
  method!: string;
  clientId!: string;
  sessionId?: string;
  createdAt!: string;

  static fromDomain(payment: Payment): PaymentResponseDto {
    const dto = new PaymentResponseDto();
    dto.id = payment.id.toString();
    dto.amount = payment.amount;
    dto.status = payment.status;
    dto.currency = payment.currency;
    dto.method = payment.method;
    dto.clientId = payment.clientId;
    dto.sessionId = payment.sessionId;
    dto.createdAt = payment.createdAt.toISOString();
    return dto;
  }
} 
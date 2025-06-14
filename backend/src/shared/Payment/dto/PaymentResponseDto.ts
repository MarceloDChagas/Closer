import { Payment } from "../types/Payment";
import { Expose } from "class-transformer";

export class PaymentResponseDto {
  @Expose()
  id!: string;

  @Expose()
  amount!: number;

  @Expose()
  currency!: string;

  @Expose()
  status!: string;

  @Expose()
  method!: string;

  @Expose()
  createdAt!: Date;

  static fromDomain(payment: Payment): PaymentResponseDto {
    const dto = new PaymentResponseDto();
    dto.id = payment.id;
    dto.amount = payment.amount;
    dto.currency = payment.currency;
    dto.status = payment.status;
    dto.method = payment.method;
    dto.createdAt = payment.createdAt;
    return dto;
  }
} 
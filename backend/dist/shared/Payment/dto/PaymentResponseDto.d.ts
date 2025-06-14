import { Payment } from "../types/Payment";
export declare class PaymentResponseDto {
    id: string;
    amount: number;
    currency: string;
    status: string;
    method: string;
    createdAt: Date;
    static fromDomain(payment: Payment): PaymentResponseDto;
}

import { Payment } from "../types/Payment";
export declare class PaymentResponseDto {
    id: string;
    amount: number;
    status: string;
    currency: string;
    method: string;
    clientId: string;
    sessionId?: string;
    createdAt: string;
    static fromDomain(payment: Payment): PaymentResponseDto;
}

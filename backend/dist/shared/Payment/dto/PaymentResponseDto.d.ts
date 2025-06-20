import { Payment } from '../types/Payment';
export declare class PaymentResponseDto {
    id: string;
    amount: number;
    currency: string;
    status: string;
    method: string;
    clientId: string;
    sessionId?: string;
    dueDate?: Date;
    createdAt: Date;
    static fromDomain(payment: Payment): PaymentResponseDto;
}

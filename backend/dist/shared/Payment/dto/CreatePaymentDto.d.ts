import { EPaymentMethod } from '../enums/EPaymentMethod';
export declare class CreatePaymentDto {
    clientId: string;
    sessionId?: string;
    amount: number;
    currency: string;
    status: string;
    method: EPaymentMethod;
    dueDate?: string;
}

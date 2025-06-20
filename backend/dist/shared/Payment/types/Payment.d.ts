import { PaymentId } from '../vo/PaymentId';
import { EPaymentMethod } from '../enums/EPaymentMethod';
export interface Payment {
    id: PaymentId;
    amount: number;
    currency: string;
    status: string;
    method: EPaymentMethod;
    clientId: string;
    sessionId?: string;
    dueDate?: Date;
    createdAt: Date;
}

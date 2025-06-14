import { PaymentId } from "../vo/PaymentId";
import { EPaymentMethod } from "../enums/EPaymentMethod";

export type Payment = {
  id: PaymentId;
  amount: number;
  status: string;
  currency: string;
  method: EPaymentMethod;
  clientId: string;
  sessionId?: string;
  createdAt: Date;
}; 
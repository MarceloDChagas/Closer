import { EPaymentMethod } from "../enums/EPaymentMethod";

export interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: string;
  method: EPaymentMethod;
  createdAt: Date;
} 
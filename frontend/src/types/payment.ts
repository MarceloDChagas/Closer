export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
  FAILED = 'FAILED'
}

export enum PaymentMethod {
  PIX = 'PIX',
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
  BANK_TRANSFER = 'BANK_TRANSFER',
  CASH = 'CASH',
  BOLETO = 'BOLETO'
}

export interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  method: PaymentMethod;
  dueDate?: string;
  clientId: string;
  sessionId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreatePaymentDto {
  clientId: string;
  sessionId?: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  method: PaymentMethod;
  dueDate?: string;
}

export interface PaymentFilters {
  status?: PaymentStatus;
  method?: PaymentMethod;
  clientId?: string;
  sessionId?: string;
  dateFrom?: string;
  dateTo?: string;
} 
import { Payment } from "@shared/Payment/types/Payment"
import { PaymentId } from "@shared/Payment/vo/PaymentId"
import { EPaymentMethod } from "@shared/Payment/enums/EPaymentMethod"

type PrismaPayment = {
  id: string
  amount: number
  status: string
  currency: string
  method: string
  clientId: string
  sessionId: string | null
  createdAt: Date
  updatedAt: Date
}

export function mapToPrisma(payment: Payment): Omit<PrismaPayment, "id" | "createdAt" | "updatedAt"> {
  return {
    amount: payment.amount,
    status: payment.status,
    currency: payment.currency,
    method: payment.method,
    clientId: payment.clientId,
    sessionId: payment.sessionId || null,
  }
}

export function mapToDomain(payment: PrismaPayment): Payment {
  return {
    id: new PaymentId(payment.id),
    amount: payment.amount,
    status: payment.status,
    currency: payment.currency,
    method: payment.method as EPaymentMethod,
    clientId: payment.clientId,
    sessionId: payment.sessionId || undefined,
    createdAt: payment.createdAt,
  }
}

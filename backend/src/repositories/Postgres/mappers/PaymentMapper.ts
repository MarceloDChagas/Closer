import { Payment } from "../../../shared/Payment/types/Payment"
import { EPaymentMethod } from "../../../shared/Payment/enums/EPaymentMethod"

type PrismaPayment = {
  id: string
  amount: number
  status: string
  currency: string
  method: string
  createdAt: Date
  updatedAt: Date
}

export function mapToPrisma(payment: Payment): Omit<PrismaPayment, "id" | "createdAt" | "updatedAt"> {
  return {
    amount: payment.amount,
    status: payment.status,
    currency: payment.currency,
    method: payment.method,
  }
}

export function mapToDomain(payment: PrismaPayment): Payment {
  return {
    id: payment.id,
    amount: payment.amount,
    status: payment.status,
    currency: payment.currency,
    method: payment.method as EPaymentMethod,
    createdAt: payment.createdAt,
  }
}

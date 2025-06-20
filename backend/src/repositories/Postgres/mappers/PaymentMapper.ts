import { Payment } from "@shared/Payment/types/Payment"
import { PaymentId } from "@shared/Payment/vo/PaymentId"
import { EPaymentMethod } from "@shared/Payment/enums/EPaymentMethod"

export class PaymentMapper {
  static toDomain(payment: any): Payment {
    return {
      id: new PaymentId(payment.id),
      amount: payment.amount,
      currency: payment.currency,
      status: payment.status,
      method: payment.method as EPaymentMethod,
      clientId: payment.clientId,
      sessionId: payment.sessionId,
      dueDate: payment.dueDate ? new Date(payment.dueDate) : undefined,
      createdAt: new Date(payment.createdAt),
    }
  }

  static toPersistence(payment: Payment): any {
    return {
      id: payment.id.value,
      amount: payment.amount,
      currency: payment.currency,
      status: payment.status,
      method: payment.method,
      clientId: payment.clientId,
      sessionId: payment.sessionId,
      dueDate: payment.dueDate,
      createdAt: payment.createdAt || new Date(),
    }
  }
}

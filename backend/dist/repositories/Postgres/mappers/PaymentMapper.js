"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentMapper = void 0;
const PaymentId_1 = require("../../../shared/Payment/vo/PaymentId");
class PaymentMapper {
    static toDomain(payment) {
        return {
            id: new PaymentId_1.PaymentId(payment.id),
            amount: payment.amount,
            currency: payment.currency,
            status: payment.status,
            method: payment.method,
            clientId: payment.clientId,
            sessionId: payment.sessionId,
            dueDate: payment.dueDate ? new Date(payment.dueDate) : undefined,
            createdAt: new Date(payment.createdAt),
        };
    }
    static toPersistence(payment) {
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
        };
    }
}
exports.PaymentMapper = PaymentMapper;

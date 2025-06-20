"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentResponseDto = void 0;
class PaymentResponseDto {
    static fromDomain(payment) {
        return {
            id: payment.id.value,
            amount: payment.amount,
            currency: payment.currency,
            status: payment.status,
            method: payment.method,
            clientId: payment.clientId,
            sessionId: payment.sessionId,
            dueDate: payment.dueDate,
            createdAt: payment.createdAt,
        };
    }
}
exports.PaymentResponseDto = PaymentResponseDto;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapToPrisma = mapToPrisma;
exports.mapToDomain = mapToDomain;
const PaymentId_1 = require("../../../shared/Payment/vo/PaymentId");
function mapToPrisma(payment) {
    return {
        amount: payment.amount,
        status: payment.status,
        currency: payment.currency,
        method: payment.method,
        clientId: payment.clientId,
        sessionId: payment.sessionId || null,
    };
}
function mapToDomain(payment) {
    return {
        id: new PaymentId_1.PaymentId(payment.id),
        amount: payment.amount,
        status: payment.status,
        currency: payment.currency,
        method: payment.method,
        clientId: payment.clientId,
        sessionId: payment.sessionId || undefined,
        createdAt: payment.createdAt,
    };
}
//# sourceMappingURL=PaymentMapper.js.map
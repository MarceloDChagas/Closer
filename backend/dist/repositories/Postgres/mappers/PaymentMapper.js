"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapToPrisma = mapToPrisma;
exports.mapToDomain = mapToDomain;
function mapToPrisma(payment) {
    return {
        amount: payment.amount,
        status: payment.status,
        currency: payment.currency,
        method: payment.method,
    };
}
function mapToDomain(payment) {
    return {
        id: payment.id,
        amount: payment.amount,
        status: payment.status,
        currency: payment.currency,
        method: payment.method,
        createdAt: payment.createdAt,
    };
}
//# sourceMappingURL=PaymentMapper.js.map
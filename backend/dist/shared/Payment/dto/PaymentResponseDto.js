"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentResponseDto = void 0;
class PaymentResponseDto {
    id;
    amount;
    status;
    currency;
    method;
    clientId;
    sessionId;
    createdAt;
    static fromDomain(payment) {
        const dto = new PaymentResponseDto();
        dto.id = payment.id.toString();
        dto.amount = payment.amount;
        dto.status = payment.status;
        dto.currency = payment.currency;
        dto.method = payment.method;
        dto.clientId = payment.clientId;
        dto.sessionId = payment.sessionId;
        dto.createdAt = payment.createdAt.toISOString();
        return dto;
    }
}
exports.PaymentResponseDto = PaymentResponseDto;
//# sourceMappingURL=PaymentResponseDto.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionResponseDto = void 0;
class SessionResponseDto {
    static fromDomain(session) {
        return {
            id: session.id.value,
            date: session.date.value,
            duration: session.duration,
            status: session.status,
            serviceType: session.serviceType,
            photoDeliveryStatus: session.photoDeliveryStatus,
            clientId: session.clientId,
        };
    }
}
exports.SessionResponseDto = SessionResponseDto;

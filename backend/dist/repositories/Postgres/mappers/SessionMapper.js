"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionMapper = void 0;
const SessionId_1 = require("../../../shared/Session/vo/SessionId");
const SystemClock_1 = require("../../../shared/Session/vo/SystemClock");
class SessionMapper {
    static toDomain(session) {
        return {
            id: new SessionId_1.SessionId(session.id),
            date: new SystemClock_1.SystemClock(new Date(session.date)),
            duration: session.duration,
            status: session.status,
            serviceType: session.serviceType,
            photoDeliveryStatus: session.photoDeliveryStatus,
            clientId: session.clientId,
        };
    }
    static toPersistence(session) {
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
exports.SessionMapper = SessionMapper;

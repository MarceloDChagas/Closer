"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapToPrisma = mapToPrisma;
exports.mapToDomain = mapToDomain;
const SessionId_1 = require("../../../shared/Session/vo/SessionId");
const SystemClock_1 = require("../../../shared/Session/vo/SystemClock");
function mapToPrisma(session) {
    return {
        date: session.date.value,
        duration: session.duration,
        status: session.status,
        clientId: session.clientId,
    };
}
function mapToDomain(session) {
    return {
        id: new SessionId_1.SessionId(session.id),
        date: new SystemClock_1.SystemClock(session.date),
        duration: session.duration,
        status: session.status,
        clientId: session.clientId,
    };
}
//# sourceMappingURL=SessionMapper.js.map
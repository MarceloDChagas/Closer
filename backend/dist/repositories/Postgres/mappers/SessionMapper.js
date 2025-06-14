"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionMapper = void 0;
const SystemClock_1 = require("../../../shared/Session/vo/SystemClock");
class SessionMapper {
    static toDomain(prismaSession) {
        return {
            id: prismaSession.id,
            date: new SystemClock_1.SystemClock(new Date(prismaSession.date)),
            duration: prismaSession.duration,
            status: prismaSession.status,
        };
    }
    static toPrisma(session) {
        return {
            id: session.id,
            date: session.date.value,
            duration: session.duration,
            status: session.status,
        };
    }
}
exports.SessionMapper = SessionMapper;
//# sourceMappingURL=SessionMapper.js.map
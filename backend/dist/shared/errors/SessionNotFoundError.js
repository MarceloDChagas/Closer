"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionNotFoundError = void 0;
class SessionNotFoundError extends Error {
    constructor(sessionId) {
        super(`Session with ID ${sessionId} not found`);
        this.name = 'SessionNotFoundError';
    }
}
exports.SessionNotFoundError = SessionNotFoundError;

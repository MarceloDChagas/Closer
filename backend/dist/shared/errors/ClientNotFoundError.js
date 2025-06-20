"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientNotFoundError = void 0;
class ClientNotFoundError extends Error {
    constructor(clientId) {
        super(`Client with ID ${clientId} not found`);
        this.name = 'ClientNotFoundError';
    }
}
exports.ClientNotFoundError = ClientNotFoundError;

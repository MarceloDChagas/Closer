export class SessionNotFoundError extends Error {
  constructor(sessionId: string) {
    super(`Session with ID ${sessionId} not found`);
    this.name = 'SessionNotFoundError';
  }
} 
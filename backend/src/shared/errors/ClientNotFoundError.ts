export class ClientNotFoundError extends Error {
  constructor(clientId: string) {
    super(`Client with ID ${clientId} not found`);
    this.name = 'ClientNotFoundError';
  }
} 
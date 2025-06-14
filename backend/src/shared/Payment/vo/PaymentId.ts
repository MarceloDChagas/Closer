export class PaymentId {
  constructor(private readonly value: string) {}

  toString(): string {
    return this.value;
  }
} 
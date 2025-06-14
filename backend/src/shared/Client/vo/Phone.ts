export class Phone {
  constructor(public readonly value: string) {
    // Aceita formatos internacionais e nacionais comuns
    if (!/^\+?\d{10,15}$/.test(value)) {
      throw new Error("Invalid phone number format");
    }
  }
} 
export class Email {
  constructor(public readonly value: string) {
    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)) {
      throw new Error("Invalid email format");
    }
  }
} 
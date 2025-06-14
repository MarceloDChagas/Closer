export class SystemClock {
  constructor(public readonly value: Date) {
    if (!(value instanceof Date) || isNaN(value.getTime())) {
      throw new Error("Invalid date");
    }
  }
} 
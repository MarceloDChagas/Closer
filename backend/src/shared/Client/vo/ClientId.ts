import { v4 as uuidv4, validate as uuidValidate } from "uuid";

export class ClientId {
  public readonly value: string;

  constructor(value?: string) {
    if (value && !uuidValidate(value)) {
      throw new Error("Invalid UUID for ClientId");
    }
    this.value = value || uuidv4();
  }
} 
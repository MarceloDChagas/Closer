import { Client } from "../shared/Client/types/Client";
import { EPaymentMethod } from "../shared/Payment/enums/EPaymentMethod";

export interface IClientRepository {
  create(client: Client): Promise<void>;
  findById(id: string): Promise<Client | null>;
  findAll(paymentMethod?: EPaymentMethod): Promise<Client[]>;
  delete(id: string): Promise<void>;
  deleteAll(): Promise<void>;
}

export default IClientRepository;

import { Client } from "../shared/Client/types/Client";
import { EPaymentMethod } from "../shared/Payment/enums/EPaymentMethod";
import { Session } from "@shared/Session/types/Session";

export interface IClientRepository {
  create(client: Client): Promise<void>;
  findById(id: string): Promise<Client | null>;
  findAll(paymentMethod?: EPaymentMethod): Promise<Client[]>;
  delete(id: string): Promise<void>;
  deleteAll(): Promise<void>;
  getAllSessionsByClient(clientId: string): Promise<Session[]>;
  getAllClientsWithOwingMoney(): Promise<Client[]>;
  getQuantityOfClients(): Promise<number>;
  getQuantityOfNewClientsThisMonth(): Promise<number>;
}

export default IClientRepository;

import { Client } from "@shared/Client/types/Client";
export interface IClientRepository {
    save(client: Client): Promise<void>;
    findById(id: string): Promise<Client | null>;
    findByEmail(email: string): Promise<Client | null>;
    findByPhone(phone: string): Promise<Client | null>;
    delete(id: string): Promise<void>;
}

import { PrismaService } from "../PrismaService";
import { IClientRepository } from "../IClientRepository";
import { Client } from "@shared/Client/types/Client";
export declare class PostgresClientRepository implements IClientRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    save(client: Client): Promise<void>;
    findById(id: string): Promise<Client | null>;
    findByEmail(email: string): Promise<Client | null>;
    findByPhone(phone: string): Promise<Client | null>;
    delete(id: string): Promise<void>;
    findAll(): Promise<Client[]>;
}

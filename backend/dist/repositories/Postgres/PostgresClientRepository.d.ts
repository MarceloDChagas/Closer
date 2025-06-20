import { PrismaService } from "../PrismaService";
import { Client } from "../../shared/Client/types/Client";
import { IClientRepository } from "../IClientRepository";
import { EPaymentMethod } from "../../shared/Payment/enums/EPaymentMethod";
import { Session } from "@shared/Session";
export declare class PostgresClientRepository implements IClientRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(client: Client): Promise<void>;
    findById(id: string): Promise<Client | null>;
    delete(id: string): Promise<void>;
    findAll(paymentMethod?: EPaymentMethod): Promise<Client[]>;
    deleteAll(): Promise<void>;
    getQuantityOfClients(): Promise<number>;
    getQuantityOfNewClientsThisMonth(): Promise<number>;
    getAllSessionsByClient(clientId: string): Promise<Session[]>;
    getAllClientsWithOwingMoney(): Promise<Client[]>;
}

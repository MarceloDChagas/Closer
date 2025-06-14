import { Client } from "../../shared/Client/types/Client";
import { IClientRepository } from "../IClientRepository";
import { PrismaService } from "../PrismaService";
import { EPaymentMethod } from "../../shared/Payment/enums/EPaymentMethod";
export declare class PostgresClientRepository implements IClientRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(client: Client): Promise<void>;
    findById(id: string): Promise<Client | null>;
    findAll(paymentMethod?: EPaymentMethod): Promise<Client[]>;
    delete(id: string): Promise<void>;
    deleteAll(): Promise<void>;
}

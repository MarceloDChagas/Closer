import { IPaymentRepository } from "../IPaymentRepository";
import { PrismaService } from "../PrismaService";
import { Payment } from "@shared/Payment/types/Payment";
import { Client } from "@shared/Client/types/Client";
import { Session } from "@shared/Session/types/Session";
export declare class PostgresPaymentRepository implements IPaymentRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(payment: Payment): Promise<void>;
    update(payment: Payment): Promise<void>;
    findById(id: string): Promise<Payment | null>;
    findAll(): Promise<Payment[]>;
    delete(id: string): Promise<void>;
    deleteAll(): Promise<void>;
    findClientById(clientId: string): Promise<Client | null>;
    findSessionById(sessionId: string): Promise<Session | null>;
    getTotalAmountOfPaymentsPending(): Promise<number>;
    getTotalAmountOfPaymentsPaid(): Promise<number>;
    getTotalAmountOfPaymentsCancelled(): Promise<number>;
    getTotalAmountOfPaymentsRefunded(): Promise<number>;
}

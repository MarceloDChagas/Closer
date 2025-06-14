import { Payment } from "../../shared/Payment/types/Payment";
import { IPaymentRepository } from "../IPaymentRepository";
import { PrismaService } from "../PrismaService";
export declare class PostgresPaymentRepository implements IPaymentRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<Payment[]>;
    findById(id: string): Promise<Payment | null>;
    create(payment: Payment): Promise<void>;
    update(payment: Payment): Promise<void>;
    delete(id: string): Promise<void>;
    deleteAll(): Promise<void>;
}

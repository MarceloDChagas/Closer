import { PrismaService } from "../PrismaService";
import { Session } from "@shared/Session/types/Session";
import { ISessionRepository } from "../ISessionRepository";
export declare class PostgresSessionRepository implements ISessionRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(session: Session): Promise<void>;
    findById(id: string): Promise<Session | null>;
    delete(id: string): Promise<void>;
    findAll(filters?: any): Promise<Session[]>;
    deleteAll(): Promise<void>;
    getQuantityOfSessions(): Promise<number>;
    getQuantityOfSessionsThisMonth(): Promise<number>;
    getQuantityOfPendingSessions(): Promise<number>;
    getQuantityOfCompletedSessions(): Promise<number>;
    getQuantityOfCancelledSessions(): Promise<number>;
    getQuantityOfRefundedSessions(): Promise<number>;
}

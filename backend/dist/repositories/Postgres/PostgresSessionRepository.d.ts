import { PrismaService } from "../PrismaService";
import { Session } from "../../shared/Session/types/Session";
import { ISessionRepository } from "../ISessionRepository";
export declare class PostgresSessionRepository implements ISessionRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    save(session: Session): Promise<void>;
    findById(id: string): Promise<Session | null>;
    findSessionsByClientId(clientId: string): Promise<Session[]>;
    findSessionsInInterval(start: Date, end: Date): Promise<Session[]>;
    delete(id: string): Promise<void>;
    update(session: Session): Promise<void>;
    findAll(): Promise<Session[]>;
    findAvailableSessionsByDate(date: Date): Promise<Session[]>;
    hasAvailableSession(clientId: string, date: Date): Promise<boolean>;
    create(session: Session): Promise<void>;
    deleteAll(): Promise<void>;
}

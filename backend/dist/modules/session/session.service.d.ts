import { ISessionRepository } from "../../repositories/ISessionRepository";
import { Session } from "@shared/Session/types/Session";
import { CreateSessionDto } from "@shared/Session/dto/CreateSessionDto";
interface SessionFilters {
    serviceType?: string;
    status?: string;
    photoDeliveryStatus?: string;
}
export declare class SessionService {
    private readonly sessionRepository;
    constructor(sessionRepository: ISessionRepository);
    createSession(createSessionDto: CreateSessionDto): Promise<Session>;
    findSessionById(id: string): Promise<Session | null>;
    deleteSession(id: string): Promise<void>;
    findAllSessions(filters?: SessionFilters): Promise<Session[]>;
    deleteAllSessions(): Promise<void>;
    getQuantityOfSessions(): Promise<number>;
    getQuantityOfSessionsThisMonth(): Promise<number>;
    getQuantityOfPendingSessions(): Promise<number>;
    getQuantityOfCompletedSessions(): Promise<number>;
    getQuantityOfCancelledSessions(): Promise<number>;
    getQuantityOfRefundedSessions(): Promise<number>;
}
export {};

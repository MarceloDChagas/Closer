import { Session } from "@shared/Session/types/Session";
export interface SessionFilters {
    serviceType?: string;
    status?: string;
    photoDeliveryStatus?: string;
}
export interface ISessionRepository {
    create(session: Session): Promise<void>;
    findById(id: string): Promise<Session | null>;
    findAll(filters?: SessionFilters): Promise<Session[]>;
    delete(id: string): Promise<void>;
    deleteAll(): Promise<void>;
    getQuantityOfSessions(): Promise<number>;
    getQuantityOfSessionsThisMonth(): Promise<number>;
    getQuantityOfPendingSessions(): Promise<number>;
    getQuantityOfCompletedSessions(): Promise<number>;
    getQuantityOfCancelledSessions(): Promise<number>;
    getQuantityOfRefundedSessions(): Promise<number>;
}
export default ISessionRepository;

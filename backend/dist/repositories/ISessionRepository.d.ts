import { Session } from "@shared/Session/types/Session";
export interface ISessionRepository {
    save(session: Session): Promise<void>;
    findById(id: string): Promise<Session | null>;
    findSessionsByClientId(clientId: string): Promise<Session[]>;
    findSessionsInInterval(start: Date, end: Date): Promise<Session[]>;
    delete(id: string): Promise<void>;
    update(session: Session): Promise<void>;
    findAll(): Promise<Session[]>;
    findAvailableSessionsByDate(date: Date): Promise<Session[]>;
}
export default ISessionRepository;

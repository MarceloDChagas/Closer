import { Session } from "../shared/Session/types/Session";
export interface ISessionRepository {
    create(session: Session): Promise<void>;
    findById(id: string): Promise<Session | null>;
    findAll(): Promise<Session[]>;
    delete(id: string): Promise<void>;
    deleteAll(): Promise<void>;
}
export default ISessionRepository;

import { ISessionRepository } from "../../repositories/ISessionRepository";
import { Session } from "@shared/Session/types/Session";
import { CreateSessionDto } from "@shared/Session/dto/CreateSessionDto";
export declare class SessionService {
    private readonly sessionRepository;
    constructor(sessionRepository: ISessionRepository);
    createSession(createSessionDto: CreateSessionDto): Promise<Session>;
    findSessionById(id: string): Promise<Session | null>;
    deleteSession(id: string): Promise<void>;
    findAllSessions(): Promise<Session[]>;
    deleteAllSessions(): Promise<void>;
}

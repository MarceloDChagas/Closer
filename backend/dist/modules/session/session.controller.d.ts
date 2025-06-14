import { SessionService } from "./session.service";
import { CreateSessionDto } from "@shared/Session/dto/CreateSessionDto";
import { SessionResponseDto } from "@shared/Session/dto/SessionResponseDto";
export declare class SessionController {
    private readonly sessionService;
    constructor(sessionService: SessionService);
    createSession(createSessionDto: CreateSessionDto): Promise<SessionResponseDto>;
    findAllSessions(): Promise<SessionResponseDto[]>;
    findSessionById(id: string): Promise<SessionResponseDto>;
    deleteSession(id: string): Promise<void>;
    deleteAllSessions(): Promise<void>;
}

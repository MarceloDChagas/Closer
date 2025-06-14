import { Session } from "../types/Session";
export declare class SessionResponseDto {
    id: string;
    date: string;
    duration: number;
    status: string;
    clientId: string;
    static fromDomain(session: Session): SessionResponseDto;
}

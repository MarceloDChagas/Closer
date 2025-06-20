import { Session } from "@shared/Session/types/Session";
export declare class SessionMapper {
    static toDomain(session: any): Session;
    static toPersistence(session: Session): any;
}

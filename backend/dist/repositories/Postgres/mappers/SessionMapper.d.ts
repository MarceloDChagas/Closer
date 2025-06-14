import { Session } from "@shared/Session/types/Session";
export declare class SessionMapper {
    static toDomain(prismaSession: any): Session;
    static toPrisma(session: Session): any;
}

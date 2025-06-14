import { Session } from "@shared/Session/types/Session";
type PrismaSession = {
    id: string;
    date: Date;
    duration: number;
    status: string;
    clientId: string;
    createdAt: Date;
    updatedAt: Date;
};
export declare function mapToPrisma(session: Session): Omit<PrismaSession, "id" | "createdAt" | "updatedAt">;
export declare function mapToDomain(session: PrismaSession): Session;
export {};

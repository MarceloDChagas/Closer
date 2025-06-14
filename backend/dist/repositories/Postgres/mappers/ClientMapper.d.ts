import { Client } from "../../../shared/Client/types/Client";
type PrismaClient = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    createdAt: Date;
    updatedAt: Date;
    payments?: any[];
};
export declare function mapToPrisma(client: Client): Omit<PrismaClient, "id" | "createdAt" | "updatedAt">;
export declare function mapToDomain(client: PrismaClient): Client;
export {};

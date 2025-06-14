import { Client } from "@shared/Client/types/Client";
export declare class ClientMapper {
    static toDomain(prismaClient: any): Client;
    static toPrisma(client: Client): any;
}

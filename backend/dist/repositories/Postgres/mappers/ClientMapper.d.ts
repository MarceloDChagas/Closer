import { Client } from "@shared/Client/types/Client";
export declare class ClientMapper {
    static toDomain(client: any): Client;
    static toPersistence(client: Client): any;
}

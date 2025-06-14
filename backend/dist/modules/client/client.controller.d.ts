import { ClientService } from "./client.service";
import { CreateClientDto } from "@shared/Client/dto/CreateClientDto";
export declare class ClientController {
    private readonly clientService;
    constructor(clientService: ClientService);
    createClient(createClientDto: CreateClientDto): Promise<{
        id: string;
        name: {
            firstName: string;
            lastName: string;
        };
        email: string;
        phone: string;
        address: {
            street: string;
            city: string;
            state: string;
            zipCode: string;
        };
    }>;
    findAllClients(): Promise<{
        id: string;
        name: {
            firstName: string;
            lastName: string;
        };
        email: string;
        phone: string;
        address: {
            street: string;
            city: string;
            state: string;
            zipCode: string;
        };
    }[]>;
    findClientById(id: string): Promise<{
        id: string;
        name: {
            firstName: string;
            lastName: string;
        };
        email: string;
        phone: string;
        address: {
            street: string;
            city: string;
            state: string;
            zipCode: string;
        };
    } | null>;
    deleteClient(id: string): Promise<void>;
}

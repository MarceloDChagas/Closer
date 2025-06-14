import { ClientService } from "./client.service";
import { CreateClientDto } from "@shared/Client/dto/CreateClientDto";
import { ClientResponseDto } from "@shared/Client/dto/ClientResponseDto";
export declare class ClientController {
    private readonly clientService;
    constructor(clientService: ClientService);
    createClient(createClientDto: CreateClientDto): Promise<ClientResponseDto>;
    findAllClients(): Promise<ClientResponseDto[]>;
    findClientById(id: string): Promise<ClientResponseDto>;
    deleteClient(id: string): Promise<void>;
    deleteAllClients(): Promise<void>;
}

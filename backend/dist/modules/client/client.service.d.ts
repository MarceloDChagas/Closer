import { IClientRepository } from "../../repositories/IClientRepository";
import { Client } from "@shared/Client/types/Client";
import { CreateClientDto } from "@shared/Client/dto/CreateClientDto";
export declare class ClientService {
    private readonly clientRepository;
    constructor(clientRepository: IClientRepository);
    createClient(createClientDto: CreateClientDto): Promise<Client>;
    findClientById(id: string): Promise<Client | null>;
    findClientByEmail(email: string): Promise<Client | null>;
    findClientByPhone(phone: string): Promise<Client | null>;
    deleteClient(id: string): Promise<void>;
    findAllClients(): Promise<Client[]>;
}

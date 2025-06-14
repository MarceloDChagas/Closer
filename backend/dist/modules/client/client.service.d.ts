import { IClientRepository } from "../../repositories/IClientRepository";
import { Client } from "@shared/Client/types/Client";
import { CreateClientDto } from "@shared/Client/dto/CreateClientDto";
import { EPaymentMethod } from "../../shared/Payment/enums/EPaymentMethod";
export declare class ClientService {
    private readonly clientRepository;
    constructor(clientRepository: IClientRepository);
    createClient(createClientDto: CreateClientDto): Promise<Client>;
    findClientById(id: string): Promise<Client | null>;
    deleteClient(id: string): Promise<void>;
    findAllClients(paymentMethod?: EPaymentMethod): Promise<Client[]>;
    deleteAllClients(): Promise<void>;
}

import { ClientService } from "./client.service";
import { CreateClientDto } from "@shared/Client/dto/CreateClientDto";
import { ClientResponseDto } from "@shared/Client/dto/ClientResponseDto";
import { EPaymentMethod } from "../../shared/Payment/enums/EPaymentMethod";
export declare class ClientController {
    private readonly clientService;
    constructor(clientService: ClientService);
    createClient(createClientDto: CreateClientDto): Promise<ClientResponseDto>;
    findAllClients(paymentMethod?: EPaymentMethod): Promise<ClientResponseDto[]>;
    findClientById(id: string): Promise<ClientResponseDto>;
    deleteClient(id: string): Promise<void>;
    deleteAllClients(): Promise<void>;
}

import { PrismaService } from '../../repositories/PrismaService';
import { CreateClientDto } from '../../shared/Client/dto/CreateClientDto';
export declare class ClientController {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createClient(createClientDto: CreateClientDto): Promise<any>;
    findAllClients(page?: string, limit?: string): Promise<{
        clients: any;
        total: any;
        page: number;
        totalPages: number;
    }>;
    getClientsQuantity(): Promise<{
        quantity: any;
    }>;
    getNewClientsThisMonth(): Promise<{
        quantity: any;
    }>;
    getClientsWithOwingMoney(): Promise<any>;
    findOneClient(id: string): Promise<any>;
    getClientSessions(id: string): Promise<any>;
    removeClient(id: string): Promise<any>;
    removeAllClients(): Promise<{
        message: string;
    }>;
}

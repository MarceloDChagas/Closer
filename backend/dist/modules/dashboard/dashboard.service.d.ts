import { IClientRepository } from '../../repositories/IClientRepository';
import { ISessionRepository } from '../../repositories/ISessionRepository';
import { PrismaService } from '../../repositories/PrismaService';
export declare class DashboardService {
    private readonly clientRepository;
    private readonly sessionRepository;
    private readonly prisma;
    constructor(clientRepository: IClientRepository, sessionRepository: ISessionRepository, prisma: PrismaService);
    getStats(): Promise<{
        totalClients: number;
        newClientsThisMonth: number;
        totalSessions: number;
        sessionsThisMonth: number;
        pendingSessions: number;
        completedSessions: number;
        cancelledSessions: number;
        refundedSessions: number;
        totalRevenue: any;
        pendingAmount: any;
        deliveredPhotos: any;
        pendingPhotos: any;
    }>;
    getRecentClients(): Promise<any>;
    getPendingPayments(): Promise<any>;
    getUpcomingSessions(): Promise<any>;
}

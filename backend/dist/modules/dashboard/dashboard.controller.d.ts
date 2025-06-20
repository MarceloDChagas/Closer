import { PrismaService } from '../../repositories/PrismaService';
export declare class DashboardController {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getDashboardStats(): Promise<{
        totalClients: any;
        newClientsThisMonth: number;
        totalSessions: any;
        sessionsThisMonth: number;
        pendingSessions: any;
        completedSessions: any;
        cancelledSessions: any;
        refundedSessions: any;
        totalRevenue: number;
        pendingAmount: number;
        deliveredPhotos: any;
        pendingPhotos: any;
    }>;
    getRecentClients(): Promise<any>;
    getPendingPayments(): Promise<any>;
    getUpcomingSessions(): Promise<any>;
    private getNewClientsThisMonth;
    private getSessionsThisMonth;
    private getTotalRevenue;
    private getPendingAmount;
}

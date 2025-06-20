import { PrismaService } from '../../repositories/PrismaService';
export declare class ReportService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    generateFinancialReport(startDate: Date, endDate: Date): Promise<{
        summary: {
            totalReceived: number;
            totalPending: number;
            totalCancelled: number;
            totalRefunded: number;
            count: any;
        };
        payments: any;
    }>;
    generateClientReport(): Promise<any>;
    generateServiceReport(): Promise<{
        serviceType: string;
        totalSessions: number;
        completedSessions: number;
        totalRevenue: number;
        averageRevenue: number;
        averageDuration: number;
        uniqueClients: number;
        completionRate: number;
    }[]>;
}

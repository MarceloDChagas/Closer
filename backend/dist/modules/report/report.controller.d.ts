import { PrismaService } from '../../repositories/PrismaService';
import { Response } from 'express';
export declare class ReportController {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getRevenueByMonth(year?: string, startDate?: string, endDate?: string): Promise<{
        month: number;
        monthName: string;
        revenue: number;
        count: number;
    }[]>;
    getServiceTypeStats(): Promise<{
        serviceType: string;
        count: number;
        revenue: number;
        averageValue: number;
    }[]>;
    getTopClients(limit?: string): Promise<any>;
    getSystemMetrics(): Promise<{
        totalClients: any;
        totalSessions: any;
        totalRevenue: any;
        pendingPayments: any;
        overduePayments: any;
        recentSessions: any;
        monthlyGrowth: number;
        averageSessionValue: number;
    }>;
    exportReportToPdf({ reportType, params }: {
        reportType: string;
        params: any;
    }, res: Response): Promise<void>;
    exportReportToExcel({ reportType, params }: {
        reportType: string;
        params: any;
    }, res: Response): Promise<void>;
}

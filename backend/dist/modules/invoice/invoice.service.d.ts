import { PrismaService } from '../../repositories/PrismaService';
export declare class InvoiceService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getInvoiceStatistics(): Promise<{
        pending: {
            amount: any;
            count: any;
        };
        paid: {
            amount: any;
            count: any;
        };
        overdue: {
            amount: any;
            count: any;
        };
        cancelled: {
            amount: any;
            count: any;
        };
    }>;
    getMonthlyRevenue(year?: number): Promise<{
        month: number;
        revenue: number;
        count: number;
    }[]>;
}

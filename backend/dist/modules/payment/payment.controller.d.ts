import { PrismaService } from '../../repositories/PrismaService';
export declare class PaymentController {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createPayment(createPaymentData: {
        amount: number;
        currency: string;
        status: string;
        method: string;
        dueDate?: string;
        clientId: string;
        sessionId?: string;
    }): Promise<any>;
    findAllPayments(page?: string, limit?: string, status?: string): Promise<{
        payments: any;
        total: any;
        page: number;
        totalPages: number;
    }>;
    findOnePayment(id: string): Promise<any>;
    updatePaymentStatus(id: string, { status }: {
        status: string;
    }): Promise<any>;
    removePayment(id: string): Promise<any>;
    removeAllPayments(): Promise<{
        message: string;
    }>;
    getTotalAmountPending(): Promise<{
        totalAmount: any;
    }>;
    getTotalAmountPaid(): Promise<{
        totalAmount: any;
    }>;
    getTotalAmountCancelled(): Promise<{
        totalAmount: any;
    }>;
    getTotalAmountRefunded(): Promise<{
        totalAmount: any;
    }>;
}

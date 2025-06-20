import { PrismaService } from '../../repositories/PrismaService';
import { Response } from 'express';
export declare class InvoiceController {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAllInvoices(page?: string, limit?: string, status?: string, clientId?: string): Promise<{
        invoices: any;
        total: any;
        page: number;
        totalPages: number;
    }>;
    findOneInvoice(id: string): Promise<{
        id: any;
        number: string;
        amount: any;
        status: any;
        dueDate: any;
        issueDate: any;
        clientId: any;
        client: any;
        sessionId: any;
        description: string;
        serviceType: any;
        createdAt: any;
        updatedAt: any;
    }>;
    createInvoice(createInvoiceData: {
        sessionId: string;
        amount: number;
        dueDate?: string;
        description?: string;
    }): Promise<{
        id: any;
        number: string;
        amount: any;
        status: any;
        dueDate: any;
        issueDate: any;
        clientId: any;
        client: any;
        sessionId: any;
        description: string;
        serviceType: any;
        createdAt: any;
        updatedAt: any;
    }>;
    updateInvoiceStatus(id: string, { status }: {
        status: string;
    }): Promise<{
        id: any;
        status: any;
        updatedAt: any;
    }>;
    generateInvoicePdf(id: string, res: Response): Promise<Response<any, Record<string, any>>>;
    sendInvoiceByEmail(id: string, { email }: {
        email: string;
    }): Promise<{
        message: string;
        success: boolean;
    }>;
    sendInvoiceByWhatsapp(id: string, { phone }: {
        phone: string;
    }): Promise<{
        message: string;
        success: boolean;
    }>;
}

import { PrismaService } from '../../repositories/PrismaService';
export declare class SessionController {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createSession(createSessionData: {
        date: string;
        duration: number;
        status: string;
        serviceType: string;
        photoDeliveryStatus?: string;
        clientId: string;
    }): Promise<any>;
    findAllSessions(page?: string, limit?: string, status?: string): Promise<{
        sessions: any;
        total: any;
        page: number;
        totalPages: number;
    }>;
    getSessionsQuantity(): Promise<{
        quantity: any;
    }>;
    getSessionsThisMonth(): Promise<{
        quantity: any;
    }>;
    getPendingSessions(): Promise<{
        quantity: any;
    }>;
    getCompletedSessions(): Promise<{
        quantity: any;
    }>;
    getCancelledSessions(): Promise<{
        quantity: any;
    }>;
    getRefundedSessions(): Promise<{
        quantity: any;
    }>;
    findOneSession(id: string): Promise<any>;
    updateSessionStatus(id: string, { status }: {
        status: string;
    }): Promise<any>;
    updatePhotoDeliveryStatus(id: string, { photoDeliveryStatus }: {
        photoDeliveryStatus: string;
    }): Promise<any>;
    removeSession(id: string): Promise<any>;
    removeAllSessions(): Promise<{
        message: string;
    }>;
}

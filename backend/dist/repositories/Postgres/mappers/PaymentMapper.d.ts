import { Payment } from "../../../shared/Payment/types/Payment";
type PrismaPayment = {
    id: string;
    amount: number;
    status: string;
    currency: string;
    method: string;
    createdAt: Date;
    updatedAt: Date;
};
export declare function mapToPrisma(payment: Payment): Omit<PrismaPayment, "id" | "createdAt" | "updatedAt">;
export declare function mapToDomain(payment: PrismaPayment): Payment;
export {};

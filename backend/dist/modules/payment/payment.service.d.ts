import { IPaymentRepository } from "../../repositories/IPaymentRepository";
import { Payment } from "@shared/Payment/types/Payment";
import { CreatePaymentDto } from "@shared/Payment/dto/CreatePaymentDto";
export declare class PaymentService {
    private readonly paymentRepository;
    constructor(paymentRepository: IPaymentRepository);
    createPayment(createPaymentDto: CreatePaymentDto): Promise<Payment>;
    findPaymentById(id: string): Promise<Payment | null>;
    deletePayment(id: string): Promise<void>;
    findAllPayments(): Promise<Payment[]>;
    deleteAllPayments(): Promise<void>;
    getTotalAmountOfPaymentsPending(): Promise<number>;
    getTotalAmountOfPaymentsPaid(): Promise<number>;
    getTotalAmountOfPaymentsCancelled(): Promise<number>;
    getTotalAmountOfPaymentsRefunded(): Promise<number>;
}

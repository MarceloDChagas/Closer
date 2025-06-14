import { PaymentService } from "./payment.service";
import { CreatePaymentDto } from "../../shared/Payment/dto/CreatePaymentDto";
import { PaymentResponseDto } from "../../shared/Payment/dto/PaymentResponseDto";
export declare class PaymentController {
    private readonly paymentService;
    constructor(paymentService: PaymentService);
    createPayment(createPaymentDto: CreatePaymentDto): Promise<PaymentResponseDto>;
    findAllPayments(): Promise<PaymentResponseDto[]>;
    findPaymentById(id: string): Promise<PaymentResponseDto>;
    deletePayment(id: string): Promise<void>;
    deleteAllPayments(): Promise<void>;
}

import { Payment } from "@shared/Payment/types/Payment";
export declare class PaymentMapper {
    static toDomain(payment: any): Payment;
    static toPersistence(payment: Payment): any;
}

import { Payment } from "../shared/Payment/types/Payment";
export interface IPaymentRepository {
    create(payment: Payment): Promise<void>;
    findById(id: string): Promise<Payment | null>;
    findAll(): Promise<Payment[]>;
    update(payment: Payment): Promise<void>;
    delete(id: string): Promise<void>;
    deleteAll(): Promise<void>;
}

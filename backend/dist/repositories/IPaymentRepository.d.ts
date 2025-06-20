import { Payment } from "../shared/Payment/types/Payment";
import { Client } from "../shared/Client/types/Client";
import { Session } from "../shared/Session/types/Session";
export interface IPaymentRepository {
    create(payment: Payment): Promise<void>;
    findById(id: string): Promise<Payment | null>;
    findAll(): Promise<Payment[]>;
    update(payment: Payment): Promise<void>;
    delete(id: string): Promise<void>;
    deleteAll(): Promise<void>;
    findClientById(id: string): Promise<Client | null>;
    findSessionById(id: string): Promise<Session | null>;
    getTotalAmountOfPaymentsPending(): Promise<number>;
    getTotalAmountOfPaymentsPaid(): Promise<number>;
    getTotalAmountOfPaymentsCancelled(): Promise<number>;
    getTotalAmountOfPaymentsRefunded(): Promise<number>;
}

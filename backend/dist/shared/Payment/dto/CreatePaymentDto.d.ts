import "reflect-metadata";
import { EPaymentMethod } from "../enums/EPaymentMethod";
export declare class CreatePaymentDto {
    amount: number;
    currency: string;
    status: string;
    method: EPaymentMethod;
}

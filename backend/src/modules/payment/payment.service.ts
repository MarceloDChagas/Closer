import { Injectable, Inject, BadRequestException } from "@nestjs/common";
import { IPaymentRepository } from "../../repositories/IPaymentRepository";
import { Payment } from "../../shared/Payment/types/Payment";
import { CreatePaymentDto } from "../../shared/Payment/dto/CreatePaymentDto";
import { PaymentStatus } from "../../shared/Payment/enums/EPaymentStatus";
import { EPaymentMethod } from "../../shared/Payment/enums/EPaymentMethod";

const PAYMENT_REPOSITORY = 'PAYMENT_REPOSITORY';

@Injectable()
export class PaymentService {
  constructor(
    @Inject(PAYMENT_REPOSITORY)
    private readonly paymentRepository: IPaymentRepository
  ) {}

  async createPayment(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    if (!Object.values(PaymentStatus).includes(createPaymentDto.status as PaymentStatus)) {
      throw new BadRequestException(`Invalid payment status. Must be one of: ${Object.values(PaymentStatus).join(', ')}`);
    }

    const payment: Payment = {
      id: crypto.randomUUID(),
      amount: createPaymentDto.amount,
      currency: createPaymentDto.currency,
      status: createPaymentDto.status,
      method: createPaymentDto.method,
      createdAt: new Date(),
    };

    await this.paymentRepository.create(payment);
    return payment;
  }

  async findPaymentById(id: string): Promise<Payment | null> {
    return this.paymentRepository.findById(id);
  }

  async deletePayment(id: string): Promise<void> {
    await this.paymentRepository.delete(id);
  }

  async findAllPayments(): Promise<Payment[]> {
    return this.paymentRepository.findAll();
  }

  async deleteAllPayments(): Promise<void> {
    await this.paymentRepository.deleteAll();
  }
}

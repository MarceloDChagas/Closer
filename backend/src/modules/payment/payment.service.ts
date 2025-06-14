import { Injectable, Inject } from "@nestjs/common";
import { IPaymentRepository } from "../../repositories/IPaymentRepository";
import { Payment } from "@shared/Payment/types/Payment";
import { CreatePaymentDto } from "@shared/Payment/dto/CreatePaymentDto";
import { PaymentId } from "@shared/Payment/vo/PaymentId";

const PAYMENT_REPOSITORY = 'PAYMENT_REPOSITORY';

@Injectable()
export class PaymentService {
  constructor(
    @Inject(PAYMENT_REPOSITORY)
    private readonly paymentRepository: IPaymentRepository
  ) {}

  async createPayment(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    const payment: Payment = {
      id: new PaymentId(crypto.randomUUID()),
      amount: createPaymentDto.amount,
      status: createPaymentDto.status,
      currency: createPaymentDto.currency,
      method: createPaymentDto.method,
      clientId: createPaymentDto.clientId,
      sessionId: createPaymentDto.sessionId,
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

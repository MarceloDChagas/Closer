import { Injectable, Inject, BadRequestException } from "@nestjs/common";
import { IPaymentRepository } from "../../repositories/IPaymentRepository";
import { Payment } from "@shared/Payment/types/Payment";
import { CreatePaymentDto } from "@shared/Payment/dto/CreatePaymentDto";
import { PaymentId } from "@shared/Payment/vo/PaymentId";
import { ClientNotFoundError } from "@shared/errors/ClientNotFoundError";
import { SessionNotFoundError } from "@shared/errors/SessionNotFoundError";
import { EPaymentMethod } from "@shared/Payment/enums/EPaymentMethod";

const PAYMENT_REPOSITORY = 'PAYMENT_REPOSITORY';

@Injectable()
export class PaymentService {
  constructor(
    @Inject(PAYMENT_REPOSITORY)
    private readonly paymentRepository: IPaymentRepository
  ) {}

  async createPayment(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    if (!Object.values(EPaymentMethod).includes(createPaymentDto.method)) {
      throw new BadRequestException(
        `Invalid payment method. Must be one of: ${Object.values(EPaymentMethod).join(', ')}`
      );
    }

    const client = await this.paymentRepository.findClientById(createPaymentDto.clientId);
    if (!client) {
      throw new ClientNotFoundError(createPaymentDto.clientId);
    }

    if (createPaymentDto.sessionId) {
      const session = await this.paymentRepository.findSessionById(createPaymentDto.sessionId);
      if (!session) {
        throw new SessionNotFoundError(createPaymentDto.sessionId);
      }
    }

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

  async getTotalAmountOfPaymentsPending(): Promise<number> {
    return this.paymentRepository.getTotalAmountOfPaymentsPending();
  }

  async getTotalAmountOfPaymentsPaid(): Promise<number> {
    return this.paymentRepository.getTotalAmountOfPaymentsPaid();
  }

  async getTotalAmountOfPaymentsCancelled(): Promise<number> {
    return this.paymentRepository.getTotalAmountOfPaymentsCancelled();
  }

  async getTotalAmountOfPaymentsRefunded(): Promise<number> {
    return this.paymentRepository.getTotalAmountOfPaymentsRefunded();
  }
  
}

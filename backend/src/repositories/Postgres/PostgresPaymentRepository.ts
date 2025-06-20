import { Injectable } from "@nestjs/common";
import { IPaymentRepository } from "../IPaymentRepository";
import { PrismaService } from "../PrismaService";
import { Payment } from "@shared/Payment/types/Payment";
import { Client } from "@shared/Client/types/Client";
import { Session } from "@shared/Session/types/Session";
import { PaymentMapper } from "./mappers/PaymentMapper";
import { ClientMapper } from "./mappers/ClientMapper";
import { SessionMapper } from "./mappers/SessionMapper";
import { EPaymentStatus } from "@shared/Payment/enums/EPaymentStatus";

@Injectable()
export class PostgresPaymentRepository implements IPaymentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(payment: Payment): Promise<void> {
    await this.prisma.payment.create({
      data: PaymentMapper.toPersistence(payment),
    });
  }

  async update(payment: Payment): Promise<void> {
    await this.prisma.payment.update({
      where: { id: payment.id.toString() },
      data: PaymentMapper.toPersistence(payment),
    });
  }

  async findById(id: string): Promise<Payment | null> {
    const payment = await this.prisma.payment.findUnique({
      where: { id },
    });
    return payment ? PaymentMapper.toDomain(payment) : null;
  }

  async findAll(): Promise<Payment[]> {
    const payments = await this.prisma.payment.findMany();
    return payments.map(PaymentMapper.toDomain);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.payment.delete({
      where: { id },
    });
  }

  async deleteAll(): Promise<void> {
    await this.prisma.payment.deleteMany();
  }

  async findClientById(clientId: string): Promise<Client | null> {
    const client = await this.prisma.client.findUnique({
      where: { id: clientId },
    });
    return client ? ClientMapper.toDomain(client) : null;
  }

  async findSessionById(sessionId: string): Promise<Session | null> {
    const session = await this.prisma.session.findUnique({
      where: { id: sessionId },
    });
    return session ? SessionMapper.toDomain(session) : null;
  }

  async getTotalAmountOfPaymentsPending(): Promise<number> {
    const result = await this.prisma.payment.aggregate({
      where: { status: EPaymentStatus.PENDING },
      _sum: { amount: true },
    });
    return result._sum.amount || 0;
  }

  async getTotalAmountOfPaymentsPaid(): Promise<number> {
    const result = await this.prisma.payment.aggregate({
      where: { status: EPaymentStatus.COMPLETED },
      _sum: { amount: true },
    });
    return result._sum.amount || 0;
  }

  async getTotalAmountOfPaymentsCancelled(): Promise<number> {
    const result = await this.prisma.payment.aggregate({
      where: { status: EPaymentStatus.CANCELLED },
      _sum: { amount: true },
    });
    return result._sum.amount || 0;
  }

  async getTotalAmountOfPaymentsRefunded(): Promise<number> {
    const result = await this.prisma.payment.aggregate({
      where: { status: EPaymentStatus.REFUNDED },
      _sum: { amount: true },
    });
    return result._sum.amount || 0;
  }
}

import { Injectable } from "@nestjs/common";
import { Payment } from "../../shared/Payment/types/Payment"
import { IPaymentRepository } from "../IPaymentRepository"
import { PrismaService } from "../PrismaService"
import { mapToDomain, mapToPrisma } from "./mappers/PaymentMapper"

@Injectable()
export class PostgresPaymentRepository implements IPaymentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Payment[]> {
    const payments = await this.prisma.payment.findMany()
    return payments.map(mapToDomain)
  }

  async findById(id: string): Promise<Payment | null> {
    const payment = await this.prisma.payment.findUnique({ where: { id } })
    return payment ? mapToDomain(payment) : null
  }

  async create(payment: Payment): Promise<void> {
    await this.prisma.payment.create({
      data: {
        ...mapToPrisma(payment),
        id: payment.id,
        createdAt: payment.createdAt,
      },
    })
  }

  async update(payment: Payment): Promise<void> {
    await this.prisma.payment.update({
      where: { id: payment.id },
      data: mapToPrisma(payment),
    })
  }

  async delete(id: string): Promise<void> {
    await this.prisma.payment.delete({ where: { id } })
  }

  async deleteAll(): Promise<void> {
    await this.prisma.payment.deleteMany()
  }
}

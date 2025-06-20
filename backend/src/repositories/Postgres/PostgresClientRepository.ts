import { Injectable } from "@nestjs/common";
import { PrismaService } from "../PrismaService";
import { Client } from "../../shared/Client/types/Client";
import { IClientRepository } from "../IClientRepository";
import { ClientMapper } from "./mappers/ClientMapper";
import { EPaymentMethod } from "../../shared/Payment/enums/EPaymentMethod";
import { Session } from "@shared/Session";
import { EPaymentStatus } from "@shared/Payment/enums/EPaymentStatus";

@Injectable()
export class PostgresClientRepository implements IClientRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(client: Client): Promise<void> {
    await this.prisma.client.create({
      data: {
        id: client.id.value,
        ...ClientMapper.toPersistence(client),
      },
    });
  }

  async findById(id: string): Promise<Client | null> {
    const client = await this.prisma.client.findUnique({
      where: { id },
      include: {
        name: true,
        address: true,
      },
    });
    return client ? ClientMapper.toDomain(client) : null;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.client.delete({
      where: { id },
    });
  }

  async findAll(paymentMethod?: EPaymentMethod): Promise<Client[]> {
    const clients = await this.prisma.client.findMany({
      include: {
        name: true,
        address: true,
      },
    });
    return clients.map(ClientMapper.toDomain);
  }

  async deleteAll(): Promise<void> {
    await this.prisma.client.deleteMany();
  }

  async getQuantityOfClients(): Promise<number> {
    return this.prisma.client.count();
  }

  async getQuantityOfNewClientsThisMonth(): Promise<number> {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    return this.prisma.client.count({
      where: {
        createdAt: {
          gte: startOfMonth,
        },
      },
    });
  }

  async getAllSessionsByClient(clientId: string): Promise<Session[]> {
    const sessions = await this.prisma.session.findMany({
      where: { clientId },
    });
    return sessions as any;
  }

  async getAllClientsWithOwingMoney(): Promise<Client[]> {
    const clients = await this.prisma.client.findMany({
      where: {
        payments: {
          some: {
            status: EPaymentStatus.PENDING,
          },
        },
      },
      include: {
        name: true,
        address: true,
      },
    });
    return clients.map(ClientMapper.toDomain);
  }
} 
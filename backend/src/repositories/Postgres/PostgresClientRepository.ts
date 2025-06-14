import { Injectable } from "@nestjs/common";
import { Client } from "../../shared/Client/types/Client";
import { IClientRepository } from "../IClientRepository";
import { PrismaService } from "../PrismaService";
import { mapToDomain, mapToPrisma } from "./mappers/ClientMapper";
import { EPaymentMethod } from "../../shared/Payment/enums/EPaymentMethod";

@Injectable()
export class PostgresClientRepository implements IClientRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(client: Client): Promise<void> {
    await this.prisma.client.create({
      data: {
        ...mapToPrisma(client),
        id: client.id.value,
        createdAt: new Date(),
      },
    });
  }

  async findById(id: string): Promise<Client | null> {
    const client = await this.prisma.client.findUnique({ 
      where: { id },
      include: {
        payments: true
      }
    });
    return client ? mapToDomain(client) : null;
  }

  async findAll(paymentMethod?: EPaymentMethod): Promise<Client[]> {
    const clients = await this.prisma.client.findMany({
      where: paymentMethod ? {
        payments: {
          some: {
            method: paymentMethod
          }
        }
      } : undefined,
      include: {
        payments: true
      }
    });
    return clients.map(mapToDomain);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.client.delete({ where: { id } });
  }

  async deleteAll(): Promise<void> {
    await this.prisma.client.deleteMany();
  }
} 
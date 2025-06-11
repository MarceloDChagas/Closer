import { Injectable } from "@nestjs/common";
import { PrismaService } from "../PrismaService";
import { IClientRepository } from "../IClientRepository";
import { Client } from "@shared/Client/types/Client";
import { ClientMapper } from "./mappers/ClientMapper";

@Injectable()
export class PostgresClientRepository implements IClientRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(client: Client): Promise<void> {
    const prismaData = ClientMapper.toPrisma(client);
    
    await this.prisma.client.upsert({
      where: { id: client.id.value },
      update: prismaData,
      create: prismaData,
    });
  }

  async findById(id: string): Promise<Client | null> {
    const prismaClient = await this.prisma.client.findUnique({
      where: { id },
    });

    return prismaClient ? ClientMapper.toDomain(prismaClient) : null;
  }

  async findByEmail(email: string): Promise<Client | null> {
    const prismaClient = await this.prisma.client.findUnique({
      where: { email },
    });

    return prismaClient ? ClientMapper.toDomain(prismaClient) : null;
  }

  async findByPhone(phone: string): Promise<Client | null> {
    const prismaClient = await this.prisma.client.findUnique({
      where: { phone },
    });

    return prismaClient ? ClientMapper.toDomain(prismaClient) : null;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.client.delete({
      where: { id },
    });
  }

  async findAll(): Promise<Client[]> {
    const prismaClients = await this.prisma.client.findMany();
    return prismaClients.map(ClientMapper.toDomain);
  }
} 
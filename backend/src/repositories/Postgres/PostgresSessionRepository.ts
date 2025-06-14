import { Injectable } from "@nestjs/common";
import { PrismaService } from "../PrismaService";
import { Session } from "../../shared/Session/types/Session";
import { ISessionRepository } from "../ISessionRepository";
import { mapToDomain, mapToPrisma } from "./mappers/SessionMapper";

@Injectable()
export class PostgresSessionRepository implements ISessionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(session: Session): Promise<void> {
    const prismaData = mapToPrisma(session);
    await this.prisma.session.create({
      data: prismaData,
    });
  }

  async findById(id: string): Promise<Session | null> {
    const session = await this.prisma.session.findUnique({ where: { id } });
    return session ? mapToDomain(session) : null;
  }
  
  async findSessionsByClientId(clientId: string): Promise<Session[]> {
    const prismaSessions = await this.prisma.session.findMany({
      where: { clientId },
    });
    return prismaSessions.map(mapToDomain);
  }
  
  async findSessionsInInterval(start: Date, end: Date): Promise<Session[]> {
    const prismaSessions = await this.prisma.session.findMany({
      where: {
        date: {
          gte: start,
          lte: end,
        },
      },
    });
    return prismaSessions.map(mapToDomain);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.session.delete({ where: { id } });
  }

  async update(session: Session): Promise<void> {
    const prismaData = mapToPrisma(session);
    await this.prisma.session.update({
      where: { id: session.id },
      data: prismaData,
    });
  }

  async findAll(): Promise<Session[]> {
    const sessions = await this.prisma.session.findMany();
    return sessions.map(mapToDomain);
  }

  async findAvailableSessionsByDate(date: Date): Promise<Session[]> {
    const prismaSessions = await this.prisma.session.findMany({
      where: { date },
    });
    return prismaSessions.map(mapToDomain);
  }

  async hasAvailableSession(clientId: string, date: Date): Promise<boolean> {
    const prismaSession = await this.prisma.session.findFirst({
      where: { clientId, date },
    });
    return prismaSession ? true : false;
  }

  async create(session: Session): Promise<void> {
    await this.prisma.session.create({
      data: {
        ...mapToPrisma(session),
        id: session.id.toString(),
        createdAt: new Date(),
      },
    });
  }

  async deleteAll(): Promise<void> {
    await this.prisma.session.deleteMany();
  }
}
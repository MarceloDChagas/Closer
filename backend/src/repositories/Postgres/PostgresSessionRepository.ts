import { Injectable } from "@nestjs/common";
import { PrismaService } from "../PrismaService";
import { Session } from "@shared/Session/types/Session";
import { SessionMapper } from "./mappers/SessionMapper";
import ISessionRepository from "../ISessionRepository";

@Injectable()
export class PostgresSessionRepository implements ISessionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(session: Session): Promise<void> {
    const prismaData = SessionMapper.toPrisma(session);
    await this.prisma.session.create({
      data: prismaData,
    });
  }

  async findById(id: string): Promise<Session | null> {
    const prismaSession = await this.prisma.session.findUnique({
      where: { id },
    });
    return prismaSession ? SessionMapper.toDomain(prismaSession) : null;
  }
  
  async findSessionsByClientId(clientId: string): Promise<Session[]> {
    const prismaSessions = await this.prisma.session.findMany({
      where: { clientId },
    });
    return prismaSessions.map(SessionMapper.toDomain);
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
    return prismaSessions.map(SessionMapper.toDomain);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.session.delete({
      where: { id },
    });
  }

  async update(session: Session): Promise<void> {
    const prismaData = SessionMapper.toPrisma(session);
    await this.prisma.session.update({
      where: { id: session.id },
      data: prismaData,
    });
  }
  async findAll(): Promise<Session[]> {
    const prismaSessions = await this.prisma.session.findMany();
    return prismaSessions.map(SessionMapper.toDomain);
  }
  async findAvailableSessionsByDate(date: Date): Promise<Session[]> {
    const prismaSessions = await this.prisma.session.findMany({
      where: { date },
    });
    return prismaSessions.map(SessionMapper.toDomain);
  }

  async hasAvailableSession(clientId: string, date: Date): Promise<boolean> {
    const prismaSession = await this.prisma.session.findFirst({
      where: { clientId, date },
    });
    return prismaSession ? true : false;
  }
}
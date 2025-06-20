import { Injectable } from "@nestjs/common";
import { PrismaService } from "../PrismaService";
import { Session } from "@shared/Session/types/Session";
import { ISessionRepository } from "../ISessionRepository";
import { SessionMapper } from "./mappers/SessionMapper";
import { ESessionStatus } from "@shared/Session/enums/ESessionStatus";

@Injectable()
export class PostgresSessionRepository implements ISessionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(session: Session): Promise<void> {
    await this.prisma.session.create({
      data: SessionMapper.toPersistence(session),
    });
  }

  async findById(id: string): Promise<Session | null> {
    const session = await this.prisma.session.findUnique({
      where: { id },
    });
    return session ? SessionMapper.toDomain(session) : null;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.session.delete({
      where: { id },
    });
  }

  async findAll(filters?: any): Promise<Session[]> {
    const sessions = await this.prisma.session.findMany({
      where: {
        ...(filters?.serviceType && { serviceType: filters.serviceType }),
        ...(filters?.status && { status: filters.status }),
        ...(filters?.photoDeliveryStatus && { photoDeliveryStatus: filters.photoDeliveryStatus }),
      },
    });
    return sessions.map(SessionMapper.toDomain);
  }

  async deleteAll(): Promise<void> {
    await this.prisma.session.deleteMany();
  }

  async getQuantityOfSessions(): Promise<number> {
    return this.prisma.session.count();
  }

  async getQuantityOfSessionsThisMonth(): Promise<number> {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    return this.prisma.session.count({
      where: {
        date: {
          gte: startOfMonth,
        },
      },
    });
  }

  async getQuantityOfPendingSessions(): Promise<number> {
    return this.prisma.session.count({
      where: { status: ESessionStatus.PENDING },
    });
  }

  async getQuantityOfCompletedSessions(): Promise<number> {
    return this.prisma.session.count({
      where: { status: ESessionStatus.COMPLETED },
    });
  }

  async getQuantityOfCancelledSessions(): Promise<number> {
    return this.prisma.session.count({
      where: { status: ESessionStatus.CANCELLED },
    });
  }
  
  async getQuantityOfRefundedSessions(): Promise<number> {
    return this.prisma.session.count({
      where: { status: ESessionStatus.REFUNDED },
    });
  }
}
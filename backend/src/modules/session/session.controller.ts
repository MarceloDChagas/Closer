import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  HttpStatus,
  HttpCode,
  NotFoundException,
  Query,
  Patch,
} from "@nestjs/common";
import { PrismaService } from '../../repositories/PrismaService';

@Controller("sessions")
export class SessionController {
  constructor(private readonly prisma: PrismaService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createSession(@Body() createSessionData: {
    date: string;
    duration: number;
    status: string;
    serviceType: string;
    photoDeliveryStatus?: string;
    clientId: string;
  }) {
    return this.prisma.session.create({
      data: {
        date: new Date(createSessionData.date),
        duration: createSessionData.duration,
        status: createSessionData.status,
        serviceType: createSessionData.serviceType,
        photoDeliveryStatus: createSessionData.photoDeliveryStatus || 'NOT_DELIVERED',
        clientId: createSessionData.clientId
      },
      include: {
        client: true,
        payment: true
      }
    });
  }

  @Get()
  async findAllSessions(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: string
  ) {
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const skip = (pageNum - 1) * limitNum;

    const where = status ? { status } : {};

    const [sessions, total] = await Promise.all([
      this.prisma.session.findMany({
        where,
        skip,
        take: limitNum,
        include: {
          client: true,
          payment: true
        },
        orderBy: { date: 'desc' }
      }),
      this.prisma.session.count({ where })
    ]);

    const transformedSessions = sessions.map(session => {
      if (session.client) {
        return {
          ...session,
          client: {
            ...session.client,
            name: {
              firstName: session.client.firstName,
              lastName: session.client.lastName,
            },
            address: {
              street: session.client.street,
              city: session.client.city,
              state: session.client.state,
              zipCode: session.client.zipCode,
            }
          }
        };
      }
      return session;
    });

    return {
      sessions: transformedSessions,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum)
    };
  }

  @Get("stats/quantity")
  async getSessionsQuantity() {
    const count = await this.prisma.session.count();
    return { quantity: count };
  }

  @Get("stats/this-month")
  async getSessionsThisMonth() {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    const count = await this.prisma.session.count({
      where: {
        date: { gte: startOfMonth }
      }
    });
    
    return { quantity: count };
  }

  @Get("stats/pending")
  async getPendingSessions() {
    const count = await this.prisma.session.count({
      where: { status: 'PENDING' }
    });
    return { quantity: count };
  }

  @Get("stats/completed")
  async getCompletedSessions() {
    const count = await this.prisma.session.count({
      where: { status: 'COMPLETED' }
    });
    return { quantity: count };
  }

  @Get("stats/cancelled")
  async getCancelledSessions() {
    const count = await this.prisma.session.count({
      where: { status: 'CANCELLED' }
    });
    return { quantity: count };
  }

  @Get("stats/refunded")
  async getRefundedSessions() {
    const count = await this.prisma.session.count({
      where: { status: 'REFUNDED' }
    });
    return { quantity: count };
  }

  @Get(":id")
  async findOneSession(@Param("id") id: string) {
    const session = await this.prisma.session.findUnique({
      where: { id },
      include: {
        client: true,
        payment: true
      }
    });

    if (session && session.client) {
      return {
        ...session,
        client: {
          ...session.client,
          name: {
            firstName: session.client.firstName,
            lastName: session.client.lastName,
          },
          address: {
            street: session.client.street,
            city: session.client.city,
            state: session.client.state,
            zipCode: session.client.zipCode,
          }
        }
      };
    }

    return session;
  }

  @Patch(":id/status")
  async updateSessionStatus(
    @Param("id") id: string,
    @Body() { status }: { status: string },
  ) {
    return this.prisma.session.update({
      where: { id },
      data: { status },
    });
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeSession(@Param("id") id: string) {
    // Remove payment associado se existir
    await this.prisma.payment.deleteMany({
      where: { sessionId: id }
    });

    return this.prisma.session.delete({
      where: { id }
    });
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeAllSessions() {
    // Remove payments associados primeiro
    await this.prisma.payment.deleteMany({
      where: { sessionId: { not: null } }
    });
    
    await this.prisma.session.deleteMany();
    return { message: 'All sessions deleted successfully' };
  }
}

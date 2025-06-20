import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../../repositories/PrismaService';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('stats')
  async getDashboardStats() {
    const [
      totalClients,
      newClientsThisMonth,
      totalSessions,
      sessionsThisMonth,
      pendingSessions,
      completedSessions,
      cancelledSessions,
      refundedSessions,
      totalRevenue,
      pendingAmount
    ] = await Promise.all([
      this.prisma.client.count(),
      this.getNewClientsThisMonth(),
      this.prisma.session.count(),
      this.getSessionsThisMonth(),
      this.prisma.session.count({ where: { status: 'PENDING' } }),
      this.prisma.session.count({ where: { status: 'COMPLETED' } }),
      this.prisma.session.count({ where: { status: 'CANCELLED' } }),
      this.prisma.session.count({ where: { status: 'REFUNDED' } }),
      this.getTotalRevenue(),
      this.getPendingAmount()
    ]);

    const [deliveredPhotos, pendingPhotos] = await Promise.all([
      this.prisma.session.count({ where: { photoDeliveryStatus: 'DELIVERED' } }),
      this.prisma.session.count({ where: { photoDeliveryStatus: 'NOT_DELIVERED' } })
    ]);

    return {
      totalClients,
      newClientsThisMonth,
      totalSessions,
      sessionsThisMonth,
      pendingSessions,
      completedSessions,
      cancelledSessions,
      refundedSessions,
      totalRevenue,
      pendingAmount,
      deliveredPhotos,
      pendingPhotos
    };
  }

  @Get('recent-clients')
  async getRecentClients() {
    return this.prisma.client.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        sessions: {
          take: 1,
          orderBy: { date: 'desc' }
        },
        payments: {
          take: 1,
          orderBy: { createdAt: 'desc' }
        }
      }
    });
  }

  @Get('pending-payments')
  async getPendingPayments() {
    return this.prisma.payment.findMany({
      where: { 
        OR: [
          { status: 'PENDING' },
          {
            AND: [
              { dueDate: { not: null } },
              { dueDate: { lt: new Date() } },
              { status: { not: 'COMPLETED' } }
            ]
          }
        ]
      },
      include: {
        client: true,
        session: true
      },
      orderBy: { dueDate: 'asc' }
    });
  }

  @Get('upcoming-sessions')
  async getUpcomingSessions() {
    return this.prisma.session.findMany({
      where: {
        status: 'SCHEDULED',
        date: { gte: new Date() }
      },
      include: {
        client: true,
        payment: true
      },
      orderBy: { date: 'asc' },
      take: 10
    });
  }

  private async getNewClientsThisMonth(): Promise<number> {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    return this.prisma.client.count({
      where: {
        createdAt: { gte: startOfMonth }
      }
    });
  }

  private async getSessionsThisMonth(): Promise<number> {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    return this.prisma.session.count({
      where: {
        date: { gte: startOfMonth }
      }
    });
  }

  private async getTotalRevenue(): Promise<number> {
    const result = await this.prisma.payment.aggregate({
      where: { status: 'COMPLETED' },
      _sum: { amount: true }
    });
    return result._sum.amount || 0;
  }

  private async getPendingAmount(): Promise<number> {
    const result = await this.prisma.payment.aggregate({
      where: { status: 'PENDING' },
      _sum: { amount: true }
    });
    return result._sum.amount || 0;
  }
} 
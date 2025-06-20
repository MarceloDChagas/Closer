import { Injectable, Inject } from '@nestjs/common';
import { IClientRepository } from '../../repositories/IClientRepository';
import { ISessionRepository } from '../../repositories/ISessionRepository';
import { PrismaService } from '../../repositories/PrismaService';
import { EPaymentStatus } from '@shared/Payment/enums/EPaymentStatus';
import { ESessionStatus } from '@shared/Session/enums/ESessionStatus';

const CLIENT_REPOSITORY = 'CLIENT_REPOSITORY';
const SESSION_REPOSITORY = 'SESSION_REPOSITORY';

@Injectable()
export class DashboardService {
  constructor(
    @Inject(CLIENT_REPOSITORY)
    private readonly clientRepository: IClientRepository,
    @Inject(SESSION_REPOSITORY) 
    private readonly sessionRepository: ISessionRepository,
    private readonly prisma: PrismaService
  ) {}

  async getStats() {
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
      pendingPayments,
      deliveredPhotos,
      pendingPhotos
    ] = await Promise.all([
      this.clientRepository.getQuantityOfClients(),
      this.clientRepository.getQuantityOfNewClientsThisMonth(),
      this.sessionRepository.getQuantityOfSessions(),
      this.sessionRepository.getQuantityOfSessionsThisMonth(),
      this.sessionRepository.getQuantityOfPendingSessions(),
      this.sessionRepository.getQuantityOfCompletedSessions(),
      this.sessionRepository.getQuantityOfCancelledSessions(),
      this.sessionRepository.getQuantityOfRefundedSessions(),
      this.prisma.payment.aggregate({
        where: { status: EPaymentStatus.COMPLETED },
        _sum: { amount: true }
      }),
      this.prisma.payment.aggregate({
        where: { status: EPaymentStatus.PENDING },
        _sum: { amount: true }
      }),
      this.prisma.session.count({
        where: { photoDeliveryStatus: 'DELIVERED' }
      }),
      this.prisma.session.count({
        where: { photoDeliveryStatus: 'NOT_DELIVERED' }
      })
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
      totalRevenue: totalRevenue._sum.amount || 0,
      pendingAmount: pendingPayments._sum.amount || 0,
      deliveredPhotos,
      pendingPhotos
    };
  }

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

  async getPendingPayments() {
    return this.prisma.payment.findMany({
      where: { 
        OR: [
          { status: EPaymentStatus.PENDING },
          {
            AND: [
              { dueDate: { not: null } },
              { dueDate: { lt: new Date() } },
              { status: { not: EPaymentStatus.COMPLETED } }
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

  async getUpcomingSessions() {
    return this.prisma.session.findMany({
      where: {
        status: ESessionStatus.SCHEDULED,
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
} 
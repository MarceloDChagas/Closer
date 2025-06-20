import { Injectable } from "@nestjs/common";
import { PrismaService } from '../../repositories/PrismaService';

@Injectable()
export class ReportService {
  constructor(private readonly prisma: PrismaService) {}

  async generateFinancialReport(startDate: Date, endDate: Date) {
    const payments = await this.prisma.payment.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      },
      include: {
        client: true,
        session: true
      }
    });

    const summary = {
      totalReceived: 0,
      totalPending: 0,
      totalCancelled: 0,
      totalRefunded: 0,
      count: payments.length
    };

    payments.forEach(payment => {
      switch (payment.status) {
        case 'COMPLETED':
          summary.totalReceived += payment.amount;
          break;
        case 'PENDING':
          summary.totalPending += payment.amount;
          break;
        case 'CANCELLED':
          summary.totalCancelled += payment.amount;
          break;
        case 'REFUNDED':
          summary.totalRefunded += payment.amount;
          break;
      }
    });

    return {
      summary,
      payments: payments.map(payment => ({
        id: payment.id,
        amount: payment.amount,
        status: payment.status,
        method: payment.method,
        dueDate: payment.dueDate,
        client: payment.client,
        session: payment.session,
        createdAt: payment.createdAt
      }))
    };
  }

  async generateClientReport() {
    const clients = await this.prisma.client.findMany({
      include: {
        sessions: {
          include: {
            payment: true
          }
        },
        payments: true
      }
    });

    return clients.map(client => {
      const totalSessions = client.sessions.length;
      const completedSessions = client.sessions.filter(
        session => session.status === 'COMPLETED'
      ).length;
      const totalRevenue = client.payments
        .filter(payment => payment.status === 'COMPLETED')
        .reduce((sum, payment) => sum + payment.amount, 0);

      return {
        id: client.id,
        name: `${client.firstName} ${client.lastName}`,
        email: client.email,
        phone: client.phone,
        totalSessions,
        completedSessions,
        totalRevenue,
        averageSessionValue: completedSessions > 0 ? totalRevenue / completedSessions : 0,
        lastSession: client.sessions.length > 0 
          ? client.sessions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0].date
          : null
      };
    });
  }

  async generateServiceReport() {
    const sessions = await this.prisma.session.findMany({
      include: {
        payment: true,
        client: true
      }
    });

    const serviceStats: Record<string, {
      count: number;
      revenue: number;
      completedCount: number;
      averageDuration: number;
      clients: Set<string>;
    }> = {};

    sessions.forEach(session => {
      if (!serviceStats[session.serviceType]) {
        serviceStats[session.serviceType] = {
          count: 0,
          revenue: 0,
          completedCount: 0,
          averageDuration: 0,
          clients: new Set()
        };
      }

      const stats = serviceStats[session.serviceType];
      stats.count += 1;
      stats.averageDuration += session.duration;
      stats.clients.add(session.clientId);

      if (session.status === 'COMPLETED') {
        stats.completedCount += 1;
      }

      if (session.payment?.status === 'COMPLETED') {
        stats.revenue += session.payment.amount;
      }
    });

    return Object.entries(serviceStats).map(([serviceType, stats]) => ({
      serviceType,
      totalSessions: stats.count,
      completedSessions: stats.completedCount,
      totalRevenue: stats.revenue,
      averageRevenue: stats.completedCount > 0 ? stats.revenue / stats.completedCount : 0,
      averageDuration: stats.count > 0 ? stats.averageDuration / stats.count : 0,
      uniqueClients: stats.clients.size,
      completionRate: stats.count > 0 ? (stats.completedCount / stats.count) * 100 : 0
    }));
  }
} 
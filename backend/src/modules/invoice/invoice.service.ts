import { Injectable } from "@nestjs/common";
import { PrismaService } from '../../repositories/PrismaService';

@Injectable()
export class InvoiceService {
  constructor(private readonly prisma: PrismaService) {}

  async getInvoiceStatistics() {
    // Estatísticas baseadas em pagamentos
    const [
      totalPending,
      totalPaid,
      totalOverdue,
      totalCancelled
    ] = await Promise.all([
      this.prisma.payment.aggregate({
        where: { status: 'PENDING' },
        _sum: { amount: true },
        _count: true
      }),
      this.prisma.payment.aggregate({
        where: { status: 'COMPLETED' },
        _sum: { amount: true },
        _count: true
      }),
      this.prisma.payment.aggregate({
        where: { 
          status: 'PENDING',
          dueDate: { lt: new Date() }
        },
        _sum: { amount: true },
        _count: true
      }),
      this.prisma.payment.aggregate({
        where: { status: 'CANCELLED' },
        _sum: { amount: true },
        _count: true
      })
    ]);

    return {
      pending: {
        amount: totalPending._sum.amount || 0,
        count: totalPending._count
      },
      paid: {
        amount: totalPaid._sum.amount || 0,
        count: totalPaid._count
      },
      overdue: {
        amount: totalOverdue._sum.amount || 0,
        count: totalOverdue._count
      },
      cancelled: {
        amount: totalCancelled._sum.amount || 0,
        count: totalCancelled._count
      }
    };
  }

  async getMonthlyRevenue(year?: number) {
    const currentYear = year || new Date().getFullYear();
    
    const payments = await this.prisma.payment.findMany({
      where: {
        status: 'COMPLETED',
        createdAt: {
          gte: new Date(`${currentYear}-01-01`),
          lte: new Date(`${currentYear}-12-31`)
        }
      },
      select: {
        amount: true,
        createdAt: true
      }
    });

    // Agrupar por mês
    const monthlyData = Array.from({ length: 12 }, (_, index) => ({
      month: index + 1,
      revenue: 0,
      count: 0
    }));

    payments.forEach(payment => {
      const month = payment.createdAt.getMonth();
      monthlyData[month].revenue += payment.amount;
      monthlyData[month].count += 1;
    });

    return monthlyData;
  }
} 
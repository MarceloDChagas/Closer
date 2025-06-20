import {
  Controller,
  Post,
  Get,
  Query,
  Body,
  Res,
} from "@nestjs/common";
import { PrismaService } from '../../repositories/PrismaService';
import { Response } from 'express';

@Controller("reports")
export class ReportController {
  constructor(private readonly prisma: PrismaService) {}

  @Get("revenue-by-month")
  async getRevenueByMonth(
    @Query('year') year?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string
  ) {
    const currentYear = year ? parseInt(year) : new Date().getFullYear();
    
    let dateFilter: any = {
      gte: new Date(`${currentYear}-01-01`),
      lte: new Date(`${currentYear}-12-31`)
    };

    if (startDate && endDate) {
      dateFilter = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      };
    }

    const payments = await this.prisma.payment.findMany({
      where: {
        status: 'COMPLETED',
        createdAt: dateFilter
      },
      select: {
        amount: true,
        createdAt: true
      }
    });

    // Agrupar por mês
    const monthlyData = Array.from({ length: 12 }, (_, index) => ({
      month: index + 1,
      monthName: new Date(2024, index).toLocaleDateString('pt-BR', { month: 'long' }),
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

  @Get("service-type-stats")
  async getServiceTypeStats() {
    const sessions = await this.prisma.session.findMany({
      include: {
        payment: true
      }
    });

    const serviceStats: Record<string, { count: number; revenue: number }> = {};

    sessions.forEach(session => {
      if (!serviceStats[session.serviceType]) {
        serviceStats[session.serviceType] = { count: 0, revenue: 0 };
      }
      serviceStats[session.serviceType].count += 1;
      if (session.payment?.status === 'COMPLETED') {
        serviceStats[session.serviceType].revenue += session.payment.amount;
      }
    });

    return Object.entries(serviceStats).map(([serviceType, stats]) => ({
      serviceType,
      count: stats.count,
      revenue: stats.revenue,
      averageValue: stats.count > 0 ? stats.revenue / stats.count : 0
    }));
  }

  @Get("top-clients")
  async getTopClients(@Query('limit') limit?: string) {
    const limitNum = parseInt(limit) || 10;

    const clients = await this.prisma.client.findMany({
      include: {
        sessions: {
          include: {
            payment: true
          }
        }
      }
    });

    const clientStats = clients.map(client => {
      const totalRevenue = client.sessions.reduce((sum, session) => {
        return sum + (session.payment?.amount || 0);
      }, 0);

      const completedSessions = client.sessions.filter(
        session => session.payment?.status === 'COMPLETED'
      ).length;

      return {
        id: client.id,
        name: `${client.firstName} ${client.lastName}`,
        email: client.email,
        phone: client.phone,
        totalSessions: client.sessions.length,
        completedSessions,
        totalRevenue,
        averageSessionValue: completedSessions > 0 ? totalRevenue / completedSessions : 0
      };
    });

    return clientStats
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, limitNum);
  }

  @Get("system-metrics")
  async getSystemMetrics() {
    const [
      totalClients,
      totalSessions,
      totalRevenue,
      pendingPayments,
      overduePayments,
      recentSessions
    ] = await Promise.all([
      this.prisma.client.count(),
      this.prisma.session.count(),
      this.prisma.payment.aggregate({
        where: { status: 'COMPLETED' },
        _sum: { amount: true }
      }),
      this.prisma.payment.count({
        where: { status: 'PENDING' }
      }),
      this.prisma.payment.count({
        where: { 
          status: 'PENDING',
          dueDate: { lt: new Date() }
        }
      }),
      this.prisma.session.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // últimos 30 dias
          }
        }
      })
    ]);

    // Crescimento mensal
    const lastMonthStart = new Date();
    lastMonthStart.setMonth(lastMonthStart.getMonth() - 1);
    lastMonthStart.setDate(1);
    
    const currentMonthStart = new Date();
    currentMonthStart.setDate(1);

    const [lastMonthRevenue, currentMonthRevenue] = await Promise.all([
      this.prisma.payment.aggregate({
        where: {
          status: 'COMPLETED',
          createdAt: {
            gte: lastMonthStart,
            lt: currentMonthStart
          }
        },
        _sum: { amount: true }
      }),
      this.prisma.payment.aggregate({
        where: {
          status: 'COMPLETED',
          createdAt: {
            gte: currentMonthStart
          }
        },
        _sum: { amount: true }
      })
    ]);

    const lastMonthTotal = lastMonthRevenue._sum.amount || 0;
    const currentMonthTotal = currentMonthRevenue._sum.amount || 0;
    const monthlyGrowth = lastMonthTotal > 0 
      ? ((currentMonthTotal - lastMonthTotal) / lastMonthTotal) * 100 
      : 0;

    return {
      totalClients,
      totalSessions,
      totalRevenue: totalRevenue._sum.amount || 0,
      pendingPayments,
      overduePayments,
      recentSessions,
      monthlyGrowth: Number(monthlyGrowth.toFixed(2)),
      averageSessionValue: totalSessions > 0 
        ? (totalRevenue._sum.amount || 0) / totalSessions 
        : 0
    };
  }

  @Post("export/pdf")
  async exportReportToPdf(
    @Body() { reportType, params }: { reportType: string; params: any },
    @Res() res: Response
  ) {
    // Simular exportação para PDF
    let reportData: any = {};

    switch (reportType) {
      case 'revenue':
        reportData = await this.getRevenueByMonth(params.year);
        break;
      case 'clients':
        reportData = await this.getTopClients(params.limit);
        break;
      case 'services':
        reportData = await this.getServiceTypeStats();
        break;
      default:
        reportData = await this.getSystemMetrics();
    }

    const pdfContent = `
      RELATÓRIO ${reportType.toUpperCase()}
      Gerado em: ${new Date().toLocaleDateString('pt-BR')}
      
      ${JSON.stringify(reportData, null, 2)}
    `;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="relatorio-${reportType}.pdf"`);
    res.send(Buffer.from(pdfContent, 'utf-8'));
  }

  @Post("export/excel")
  async exportReportToExcel(
    @Body() { reportType, params }: { reportType: string; params: any },
    @Res() res: Response
  ) {
    // Simular exportação para Excel
    let reportData: any = {};

    switch (reportType) {
      case 'revenue':
        reportData = await this.getRevenueByMonth(params.year);
        break;
      case 'clients':
        reportData = await this.getTopClients(params.limit);
        break;
      case 'services':
        reportData = await this.getServiceTypeStats();
        break;
      default:
        reportData = await this.getSystemMetrics();
    }

    const csvContent = `data:text/csv;charset=utf-8,${JSON.stringify(reportData)}`;

    res.setHeader('Content-Type', 'application/vnd.ms-excel');
    res.setHeader('Content-Disposition', `attachment; filename="relatorio-${reportType}.xlsx"`);
    res.send(Buffer.from(csvContent, 'utf-8'));
  }
} 
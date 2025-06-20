"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportController = void 0;
const common_1 = require("@nestjs/common");
const PrismaService_1 = require("../../repositories/PrismaService");
let ReportController = exports.ReportController = class ReportController {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getRevenueByMonth(year, startDate, endDate) {
        const currentYear = year ? parseInt(year) : new Date().getFullYear();
        let dateFilter = {
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
    async getServiceTypeStats() {
        const sessions = await this.prisma.session.findMany({
            include: {
                payment: true
            }
        });
        const serviceStats = {};
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
    async getTopClients(limit) {
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
            const completedSessions = client.sessions.filter(session => session.payment?.status === 'COMPLETED').length;
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
    async getSystemMetrics() {
        const [totalClients, totalSessions, totalRevenue, pendingPayments, overduePayments, recentSessions] = await Promise.all([
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
                        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                    }
                }
            })
        ]);
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
    async exportReportToPdf({ reportType, params }, res) {
        let reportData = {};
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
    async exportReportToExcel({ reportType, params }, res) {
        let reportData = {};
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
};
__decorate([
    (0, common_1.Get)("revenue-by-month"),
    __param(0, (0, common_1.Query)('year')),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], ReportController.prototype, "getRevenueByMonth", null);
__decorate([
    (0, common_1.Get)("service-type-stats"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ReportController.prototype, "getServiceTypeStats", null);
__decorate([
    (0, common_1.Get)("top-clients"),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReportController.prototype, "getTopClients", null);
__decorate([
    (0, common_1.Get)("system-metrics"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ReportController.prototype, "getSystemMetrics", null);
__decorate([
    (0, common_1.Post)("export/pdf"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ReportController.prototype, "exportReportToPdf", null);
__decorate([
    (0, common_1.Post)("export/excel"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ReportController.prototype, "exportReportToExcel", null);
exports.ReportController = ReportController = __decorate([
    (0, common_1.Controller)("reports"),
    __metadata("design:paramtypes", [PrismaService_1.PrismaService])
], ReportController);

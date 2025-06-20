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
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoiceService = void 0;
const common_1 = require("@nestjs/common");
const PrismaService_1 = require("../../repositories/PrismaService");
let InvoiceService = exports.InvoiceService = class InvoiceService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getInvoiceStatistics() {
        const [totalPending, totalPaid, totalOverdue, totalCancelled] = await Promise.all([
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
    async getMonthlyRevenue(year) {
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
};
exports.InvoiceService = InvoiceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [PrismaService_1.PrismaService])
], InvoiceService);

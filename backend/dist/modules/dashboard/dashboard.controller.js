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
exports.DashboardController = void 0;
const common_1 = require("@nestjs/common");
const PrismaService_1 = require("../../repositories/PrismaService");
let DashboardController = exports.DashboardController = class DashboardController {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDashboardStats() {
        const [totalClients, newClientsThisMonth, totalSessions, sessionsThisMonth, pendingSessions, completedSessions, cancelledSessions, refundedSessions, totalRevenue, pendingAmount] = await Promise.all([
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
    async getNewClientsThisMonth() {
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);
        return this.prisma.client.count({
            where: {
                createdAt: { gte: startOfMonth }
            }
        });
    }
    async getSessionsThisMonth() {
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);
        return this.prisma.session.count({
            where: {
                date: { gte: startOfMonth }
            }
        });
    }
    async getTotalRevenue() {
        const result = await this.prisma.payment.aggregate({
            where: { status: 'COMPLETED' },
            _sum: { amount: true }
        });
        return result._sum.amount || 0;
    }
    async getPendingAmount() {
        const result = await this.prisma.payment.aggregate({
            where: { status: 'PENDING' },
            _sum: { amount: true }
        });
        return result._sum.amount || 0;
    }
};
__decorate([
    (0, common_1.Get)('stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getDashboardStats", null);
__decorate([
    (0, common_1.Get)('recent-clients'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getRecentClients", null);
__decorate([
    (0, common_1.Get)('pending-payments'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getPendingPayments", null);
__decorate([
    (0, common_1.Get)('upcoming-sessions'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getUpcomingSessions", null);
exports.DashboardController = DashboardController = __decorate([
    (0, common_1.Controller)('dashboard'),
    __metadata("design:paramtypes", [PrismaService_1.PrismaService])
], DashboardController);

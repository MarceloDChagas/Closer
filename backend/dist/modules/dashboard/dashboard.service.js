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
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const PrismaService_1 = require("../../repositories/PrismaService");
const EPaymentStatus_1 = require("../../shared/Payment/enums/EPaymentStatus");
const ESessionStatus_1 = require("../../shared/Session/enums/ESessionStatus");
const CLIENT_REPOSITORY = 'CLIENT_REPOSITORY';
const SESSION_REPOSITORY = 'SESSION_REPOSITORY';
let DashboardService = exports.DashboardService = class DashboardService {
    constructor(clientRepository, sessionRepository, prisma) {
        this.clientRepository = clientRepository;
        this.sessionRepository = sessionRepository;
        this.prisma = prisma;
    }
    async getStats() {
        const [totalClients, newClientsThisMonth, totalSessions, sessionsThisMonth, pendingSessions, completedSessions, cancelledSessions, refundedSessions, totalRevenue, pendingPayments, deliveredPhotos, pendingPhotos] = await Promise.all([
            this.clientRepository.getQuantityOfClients(),
            this.clientRepository.getQuantityOfNewClientsThisMonth(),
            this.sessionRepository.getQuantityOfSessions(),
            this.sessionRepository.getQuantityOfSessionsThisMonth(),
            this.sessionRepository.getQuantityOfPendingSessions(),
            this.sessionRepository.getQuantityOfCompletedSessions(),
            this.sessionRepository.getQuantityOfCancelledSessions(),
            this.sessionRepository.getQuantityOfRefundedSessions(),
            this.prisma.payment.aggregate({
                where: { status: EPaymentStatus_1.EPaymentStatus.COMPLETED },
                _sum: { amount: true }
            }),
            this.prisma.payment.aggregate({
                where: { status: EPaymentStatus_1.EPaymentStatus.PENDING },
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
                    { status: EPaymentStatus_1.EPaymentStatus.PENDING },
                    {
                        AND: [
                            { dueDate: { not: null } },
                            { dueDate: { lt: new Date() } },
                            { status: { not: EPaymentStatus_1.EPaymentStatus.COMPLETED } }
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
                status: ESessionStatus_1.ESessionStatus.SCHEDULED,
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
};
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(CLIENT_REPOSITORY)),
    __param(1, (0, common_1.Inject)(SESSION_REPOSITORY)),
    __metadata("design:paramtypes", [Object, Object, PrismaService_1.PrismaService])
], DashboardService);

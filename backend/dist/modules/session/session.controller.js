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
exports.SessionController = void 0;
const common_1 = require("@nestjs/common");
const PrismaService_1 = require("../../repositories/PrismaService");
let SessionController = exports.SessionController = class SessionController {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createSession(createSessionData) {
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
    async findAllSessions(page, limit, status) {
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
    async getSessionsQuantity() {
        const count = await this.prisma.session.count();
        return { quantity: count };
    }
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
    async getPendingSessions() {
        const count = await this.prisma.session.count({
            where: { status: 'PENDING' }
        });
        return { quantity: count };
    }
    async getCompletedSessions() {
        const count = await this.prisma.session.count({
            where: { status: 'COMPLETED' }
        });
        return { quantity: count };
    }
    async getCancelledSessions() {
        const count = await this.prisma.session.count({
            where: { status: 'CANCELLED' }
        });
        return { quantity: count };
    }
    async getRefundedSessions() {
        const count = await this.prisma.session.count({
            where: { status: 'REFUNDED' }
        });
        return { quantity: count };
    }
    async findOneSession(id) {
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
    async updateSessionStatus(id, { status }) {
        return this.prisma.session.update({
            where: { id },
            data: { status },
        });
    }
    async removeSession(id) {
        await this.prisma.payment.deleteMany({
            where: { sessionId: id }
        });
        return this.prisma.session.delete({
            where: { id }
        });
    }
    async removeAllSessions() {
        await this.prisma.payment.deleteMany({
            where: { sessionId: { not: null } }
        });
        await this.prisma.session.deleteMany();
        return { message: 'All sessions deleted successfully' };
    }
};
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SessionController.prototype, "createSession", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], SessionController.prototype, "findAllSessions", null);
__decorate([
    (0, common_1.Get)("stats/quantity"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SessionController.prototype, "getSessionsQuantity", null);
__decorate([
    (0, common_1.Get)("stats/this-month"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SessionController.prototype, "getSessionsThisMonth", null);
__decorate([
    (0, common_1.Get)("stats/pending"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SessionController.prototype, "getPendingSessions", null);
__decorate([
    (0, common_1.Get)("stats/completed"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SessionController.prototype, "getCompletedSessions", null);
__decorate([
    (0, common_1.Get)("stats/cancelled"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SessionController.prototype, "getCancelledSessions", null);
__decorate([
    (0, common_1.Get)("stats/refunded"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SessionController.prototype, "getRefundedSessions", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SessionController.prototype, "findOneSession", null);
__decorate([
    (0, common_1.Patch)(":id/status"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SessionController.prototype, "updateSessionStatus", null);
__decorate([
    (0, common_1.Delete)(":id"),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SessionController.prototype, "removeSession", null);
__decorate([
    (0, common_1.Delete)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SessionController.prototype, "removeAllSessions", null);
exports.SessionController = SessionController = __decorate([
    (0, common_1.Controller)("sessions"),
    __metadata("design:paramtypes", [PrismaService_1.PrismaService])
], SessionController);

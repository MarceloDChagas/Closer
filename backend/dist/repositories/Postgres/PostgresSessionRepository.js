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
exports.PostgresSessionRepository = void 0;
const common_1 = require("@nestjs/common");
const PrismaService_1 = require("../PrismaService");
const SessionMapper_1 = require("./mappers/SessionMapper");
const ESessionStatus_1 = require("../../shared/Session/enums/ESessionStatus");
let PostgresSessionRepository = exports.PostgresSessionRepository = class PostgresSessionRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(session) {
        await this.prisma.session.create({
            data: SessionMapper_1.SessionMapper.toPersistence(session),
        });
    }
    async findById(id) {
        const session = await this.prisma.session.findUnique({
            where: { id },
        });
        return session ? SessionMapper_1.SessionMapper.toDomain(session) : null;
    }
    async delete(id) {
        await this.prisma.session.delete({
            where: { id },
        });
    }
    async findAll(filters) {
        const sessions = await this.prisma.session.findMany({
            where: {
                ...(filters?.serviceType && { serviceType: filters.serviceType }),
                ...(filters?.status && { status: filters.status }),
                ...(filters?.photoDeliveryStatus && { photoDeliveryStatus: filters.photoDeliveryStatus }),
            },
        });
        return sessions.map(SessionMapper_1.SessionMapper.toDomain);
    }
    async deleteAll() {
        await this.prisma.session.deleteMany();
    }
    async getQuantityOfSessions() {
        return this.prisma.session.count();
    }
    async getQuantityOfSessionsThisMonth() {
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);
        return this.prisma.session.count({
            where: {
                date: {
                    gte: startOfMonth,
                },
            },
        });
    }
    async getQuantityOfPendingSessions() {
        return this.prisma.session.count({
            where: { status: ESessionStatus_1.ESessionStatus.PENDING },
        });
    }
    async getQuantityOfCompletedSessions() {
        return this.prisma.session.count({
            where: { status: ESessionStatus_1.ESessionStatus.COMPLETED },
        });
    }
    async getQuantityOfCancelledSessions() {
        return this.prisma.session.count({
            where: { status: ESessionStatus_1.ESessionStatus.CANCELLED },
        });
    }
    async getQuantityOfRefundedSessions() {
        return this.prisma.session.count({
            where: { status: ESessionStatus_1.ESessionStatus.REFUNDED },
        });
    }
};
exports.PostgresSessionRepository = PostgresSessionRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [PrismaService_1.PrismaService])
], PostgresSessionRepository);

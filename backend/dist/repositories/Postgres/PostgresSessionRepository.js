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
let PostgresSessionRepository = class PostgresSessionRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async save(session) {
        const prismaData = (0, SessionMapper_1.mapToPrisma)(session);
        await this.prisma.session.create({
            data: prismaData,
        });
    }
    async findById(id) {
        const session = await this.prisma.session.findUnique({ where: { id } });
        return session ? (0, SessionMapper_1.mapToDomain)(session) : null;
    }
    async findSessionsByClientId(clientId) {
        const prismaSessions = await this.prisma.session.findMany({
            where: { clientId },
        });
        return prismaSessions.map(SessionMapper_1.mapToDomain);
    }
    async findSessionsInInterval(start, end) {
        const prismaSessions = await this.prisma.session.findMany({
            where: {
                date: {
                    gte: start,
                    lte: end,
                },
            },
        });
        return prismaSessions.map(SessionMapper_1.mapToDomain);
    }
    async delete(id) {
        await this.prisma.session.delete({ where: { id } });
    }
    async update(session) {
        const prismaData = (0, SessionMapper_1.mapToPrisma)(session);
        await this.prisma.session.update({
            where: { id: session.id },
            data: prismaData,
        });
    }
    async findAll() {
        const sessions = await this.prisma.session.findMany();
        return sessions.map(SessionMapper_1.mapToDomain);
    }
    async findAvailableSessionsByDate(date) {
        const prismaSessions = await this.prisma.session.findMany({
            where: { date },
        });
        return prismaSessions.map(SessionMapper_1.mapToDomain);
    }
    async hasAvailableSession(clientId, date) {
        const prismaSession = await this.prisma.session.findFirst({
            where: { clientId, date },
        });
        return prismaSession ? true : false;
    }
    async create(session) {
        await this.prisma.session.create({
            data: {
                ...(0, SessionMapper_1.mapToPrisma)(session),
                id: session.id.toString(),
                createdAt: new Date(),
            },
        });
    }
    async deleteAll() {
        await this.prisma.session.deleteMany();
    }
};
exports.PostgresSessionRepository = PostgresSessionRepository;
exports.PostgresSessionRepository = PostgresSessionRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [PrismaService_1.PrismaService])
], PostgresSessionRepository);
//# sourceMappingURL=PostgresSessionRepository.js.map
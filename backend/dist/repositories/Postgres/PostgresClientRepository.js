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
exports.PostgresClientRepository = void 0;
const common_1 = require("@nestjs/common");
const PrismaService_1 = require("../PrismaService");
const ClientMapper_1 = require("./mappers/ClientMapper");
const EPaymentStatus_1 = require("../../shared/Payment/enums/EPaymentStatus");
let PostgresClientRepository = exports.PostgresClientRepository = class PostgresClientRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(client) {
        await this.prisma.client.create({
            data: {
                id: client.id.value,
                ...ClientMapper_1.ClientMapper.toPersistence(client),
            },
        });
    }
    async findById(id) {
        const client = await this.prisma.client.findUnique({
            where: { id },
            include: {
                name: true,
                address: true,
            },
        });
        return client ? ClientMapper_1.ClientMapper.toDomain(client) : null;
    }
    async delete(id) {
        await this.prisma.client.delete({
            where: { id },
        });
    }
    async findAll(paymentMethod) {
        const clients = await this.prisma.client.findMany({
            include: {
                name: true,
                address: true,
            },
        });
        return clients.map(ClientMapper_1.ClientMapper.toDomain);
    }
    async deleteAll() {
        await this.prisma.client.deleteMany();
    }
    async getQuantityOfClients() {
        return this.prisma.client.count();
    }
    async getQuantityOfNewClientsThisMonth() {
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);
        return this.prisma.client.count({
            where: {
                createdAt: {
                    gte: startOfMonth,
                },
            },
        });
    }
    async getAllSessionsByClient(clientId) {
        const sessions = await this.prisma.session.findMany({
            where: { clientId },
        });
        return sessions;
    }
    async getAllClientsWithOwingMoney() {
        const clients = await this.prisma.client.findMany({
            where: {
                payments: {
                    some: {
                        status: EPaymentStatus_1.EPaymentStatus.PENDING,
                    },
                },
            },
            include: {
                name: true,
                address: true,
            },
        });
        return clients.map(ClientMapper_1.ClientMapper.toDomain);
    }
};
exports.PostgresClientRepository = PostgresClientRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [PrismaService_1.PrismaService])
], PostgresClientRepository);

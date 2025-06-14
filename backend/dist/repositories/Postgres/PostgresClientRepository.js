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
let PostgresClientRepository = class PostgresClientRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(client) {
        await this.prisma.client.create({
            data: {
                ...(0, ClientMapper_1.mapToPrisma)(client),
                id: client.id.value,
                createdAt: new Date(),
            },
        });
    }
    async findById(id) {
        const client = await this.prisma.client.findUnique({
            where: { id },
            include: {
                payments: true
            }
        });
        return client ? (0, ClientMapper_1.mapToDomain)(client) : null;
    }
    async findAll(paymentMethod) {
        const clients = await this.prisma.client.findMany({
            where: paymentMethod ? {
                payments: {
                    some: {
                        method: paymentMethod
                    }
                }
            } : undefined,
            include: {
                payments: true
            }
        });
        return clients.map(ClientMapper_1.mapToDomain);
    }
    async delete(id) {
        await this.prisma.client.delete({ where: { id } });
    }
    async deleteAll() {
        await this.prisma.client.deleteMany();
    }
};
exports.PostgresClientRepository = PostgresClientRepository;
exports.PostgresClientRepository = PostgresClientRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [PrismaService_1.PrismaService])
], PostgresClientRepository);
//# sourceMappingURL=PostgresClientRepository.js.map
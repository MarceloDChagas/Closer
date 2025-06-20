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
exports.ClientController = void 0;
const common_1 = require("@nestjs/common");
const PrismaService_1 = require("../../repositories/PrismaService");
const CreateClientDto_1 = require("../../shared/Client/dto/CreateClientDto");
let ClientController = exports.ClientController = class ClientController {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createClient(createClientDto) {
        console.log('Received client data:', JSON.stringify(createClientDto, null, 2));
        const newClient = await this.prisma.client.create({
            data: {
                firstName: createClientDto.name.firstName,
                lastName: createClientDto.name.lastName,
                email: createClientDto.email,
                phone: createClientDto.phone,
                street: createClientDto.address?.street || 'Não informado',
                city: createClientDto.address?.city || 'Não informado',
                state: createClientDto.address?.state || 'Não informado',
                zipCode: createClientDto.address?.zipCode || '00000-000',
            }
        });
        return {
            ...newClient,
            name: {
                firstName: newClient.firstName,
                lastName: newClient.lastName
            },
            address: {
                street: newClient.street,
                city: newClient.city,
                state: newClient.state,
                zipCode: newClient.zipCode
            }
        };
    }
    async findAllClients(page, limit) {
        const pageNum = parseInt(page) || 1;
        const limitNum = parseInt(limit) || 10;
        const skip = (pageNum - 1) * limitNum;
        const [clients, total] = await Promise.all([
            this.prisma.client.findMany({
                skip,
                take: limitNum,
                include: {
                    sessions: {
                        take: 1,
                        orderBy: { date: 'desc' }
                    },
                    payments: {
                        take: 1,
                        orderBy: { createdAt: 'desc' }
                    }
                },
                orderBy: { createdAt: 'desc' }
            }),
            this.prisma.client.count()
        ]);
        const transformedClients = clients.map(client => ({
            ...client,
            name: {
                firstName: client.firstName,
                lastName: client.lastName
            },
            address: {
                street: client.street,
                city: client.city,
                state: client.state,
                zipCode: client.zipCode
            }
        }));
        return {
            clients: transformedClients,
            total,
            page: pageNum,
            totalPages: Math.ceil(total / limitNum)
        };
    }
    async getClientsQuantity() {
        const count = await this.prisma.client.count();
        return { quantity: count };
    }
    async getNewClientsThisMonth() {
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);
        const count = await this.prisma.client.count({
            where: {
                createdAt: { gte: startOfMonth }
            }
        });
        return { quantity: count };
    }
    async getClientsWithOwingMoney() {
        const clients = await this.prisma.client.findMany({
            where: {
                payments: {
                    some: {
                        status: 'PENDING'
                    }
                }
            },
            include: {
                payments: {
                    where: { status: 'PENDING' },
                    orderBy: { dueDate: 'asc' }
                }
            }
        });
        return clients.map(client => ({
            ...client,
            name: {
                firstName: client.firstName,
                lastName: client.lastName
            },
            address: {
                street: client.street,
                city: client.city,
                state: client.state,
                zipCode: client.zipCode
            }
        }));
    }
    async findOneClient(id) {
        const client = await this.prisma.client.findUnique({
            where: { id },
            include: {
                sessions: {
                    include: {
                        payment: true
                    },
                    orderBy: { date: 'desc' }
                },
                payments: {
                    orderBy: { createdAt: 'desc' }
                }
            }
        });
        if (!client) {
            throw new common_1.NotFoundException(`Client with ID ${id} not found`);
        }
        return {
            ...client,
            name: {
                firstName: client.firstName,
                lastName: client.lastName
            },
            address: {
                street: client.street,
                city: client.city,
                state: client.state,
                zipCode: client.zipCode
            }
        };
    }
    async getClientSessions(id) {
        return this.prisma.session.findMany({
            where: { clientId: id },
            include: {
                payment: true
            },
            orderBy: { date: 'desc' }
        });
    }
    async removeClient(id) {
        const sessionsCount = await this.prisma.session.count({
            where: { clientId: id }
        });
        if (sessionsCount > 0) {
            throw new Error('Cannot delete client with existing sessions');
        }
        return this.prisma.client.delete({
            where: { id }
        });
    }
    async removeAllClients() {
        await this.prisma.payment.deleteMany();
        await this.prisma.session.deleteMany();
        await this.prisma.client.deleteMany();
        return { message: 'All clients deleted successfully' };
    }
};
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateClientDto_1.CreateClientDto]),
    __metadata("design:returntype", Promise)
], ClientController.prototype, "createClient", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ClientController.prototype, "findAllClients", null);
__decorate([
    (0, common_1.Get)("stats/quantity"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ClientController.prototype, "getClientsQuantity", null);
__decorate([
    (0, common_1.Get)("stats/new-this-month"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ClientController.prototype, "getNewClientsThisMonth", null);
__decorate([
    (0, common_1.Get)("with-owing-money"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ClientController.prototype, "getClientsWithOwingMoney", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ClientController.prototype, "findOneClient", null);
__decorate([
    (0, common_1.Get)(":id/sessions"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ClientController.prototype, "getClientSessions", null);
__decorate([
    (0, common_1.Delete)(":id"),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ClientController.prototype, "removeClient", null);
__decorate([
    (0, common_1.Delete)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ClientController.prototype, "removeAllClients", null);
exports.ClientController = ClientController = __decorate([
    (0, common_1.Controller)("clients"),
    __metadata("design:paramtypes", [PrismaService_1.PrismaService])
], ClientController);

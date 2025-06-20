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
exports.PostgresPaymentRepository = void 0;
const common_1 = require("@nestjs/common");
const PrismaService_1 = require("../PrismaService");
const PaymentMapper_1 = require("./mappers/PaymentMapper");
const ClientMapper_1 = require("./mappers/ClientMapper");
const SessionMapper_1 = require("./mappers/SessionMapper");
const EPaymentStatus_1 = require("../../shared/Payment/enums/EPaymentStatus");
let PostgresPaymentRepository = exports.PostgresPaymentRepository = class PostgresPaymentRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(payment) {
        await this.prisma.payment.create({
            data: PaymentMapper_1.PaymentMapper.toPersistence(payment),
        });
    }
    async update(payment) {
        await this.prisma.payment.update({
            where: { id: payment.id.toString() },
            data: PaymentMapper_1.PaymentMapper.toPersistence(payment),
        });
    }
    async findById(id) {
        const payment = await this.prisma.payment.findUnique({
            where: { id },
        });
        return payment ? PaymentMapper_1.PaymentMapper.toDomain(payment) : null;
    }
    async findAll() {
        const payments = await this.prisma.payment.findMany();
        return payments.map(PaymentMapper_1.PaymentMapper.toDomain);
    }
    async delete(id) {
        await this.prisma.payment.delete({
            where: { id },
        });
    }
    async deleteAll() {
        await this.prisma.payment.deleteMany();
    }
    async findClientById(clientId) {
        const client = await this.prisma.client.findUnique({
            where: { id: clientId },
        });
        return client ? ClientMapper_1.ClientMapper.toDomain(client) : null;
    }
    async findSessionById(sessionId) {
        const session = await this.prisma.session.findUnique({
            where: { id: sessionId },
        });
        return session ? SessionMapper_1.SessionMapper.toDomain(session) : null;
    }
    async getTotalAmountOfPaymentsPending() {
        const result = await this.prisma.payment.aggregate({
            where: { status: EPaymentStatus_1.EPaymentStatus.PENDING },
            _sum: { amount: true },
        });
        return result._sum.amount || 0;
    }
    async getTotalAmountOfPaymentsPaid() {
        const result = await this.prisma.payment.aggregate({
            where: { status: EPaymentStatus_1.EPaymentStatus.COMPLETED },
            _sum: { amount: true },
        });
        return result._sum.amount || 0;
    }
    async getTotalAmountOfPaymentsCancelled() {
        const result = await this.prisma.payment.aggregate({
            where: { status: EPaymentStatus_1.EPaymentStatus.CANCELLED },
            _sum: { amount: true },
        });
        return result._sum.amount || 0;
    }
    async getTotalAmountOfPaymentsRefunded() {
        const result = await this.prisma.payment.aggregate({
            where: { status: EPaymentStatus_1.EPaymentStatus.REFUNDED },
            _sum: { amount: true },
        });
        return result._sum.amount || 0;
    }
};
exports.PostgresPaymentRepository = PostgresPaymentRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [PrismaService_1.PrismaService])
], PostgresPaymentRepository);

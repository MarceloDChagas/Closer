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
exports.PaymentController = void 0;
const common_1 = require("@nestjs/common");
const PrismaService_1 = require("../../repositories/PrismaService");
let PaymentController = exports.PaymentController = class PaymentController {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createPayment(createPaymentData) {
        const paymentData = {
            amount: createPaymentData.amount,
            currency: createPaymentData.currency,
            status: createPaymentData.status,
            method: createPaymentData.method,
            clientId: createPaymentData.clientId
        };
        if (createPaymentData.dueDate) {
            paymentData.dueDate = new Date(createPaymentData.dueDate);
        }
        if (createPaymentData.sessionId) {
            paymentData.sessionId = createPaymentData.sessionId;
        }
        const newPayment = await this.prisma.payment.create({
            data: paymentData,
            include: {
                client: true,
                session: true
            }
        });
        if (newPayment.client) {
            return {
                ...newPayment,
                client: {
                    ...newPayment.client,
                    name: {
                        firstName: newPayment.client.firstName,
                        lastName: newPayment.client.lastName,
                    },
                    address: {
                        street: newPayment.client.street,
                        city: newPayment.client.city,
                        state: newPayment.client.state,
                        zipCode: newPayment.client.zipCode,
                    }
                }
            };
        }
        return newPayment;
    }
    async findAllPayments(page, limit, status) {
        const pageNum = parseInt(page) || 1;
        const limitNum = parseInt(limit) || 10;
        const skip = (pageNum - 1) * limitNum;
        const where = status ? { status } : {};
        const [payments, total] = await Promise.all([
            this.prisma.payment.findMany({
                where,
                skip,
                take: limitNum,
                include: {
                    client: true,
                    session: true
                },
                orderBy: { createdAt: 'desc' }
            }),
            this.prisma.payment.count({ where })
        ]);
        const transformedPayments = payments.map(payment => {
            if (payment.client) {
                return {
                    ...payment,
                    client: {
                        ...payment.client,
                        name: {
                            firstName: payment.client.firstName,
                            lastName: payment.client.lastName,
                        },
                        address: {
                            street: payment.client.street,
                            city: payment.client.city,
                            state: payment.client.state,
                            zipCode: payment.client.zipCode,
                        }
                    }
                };
            }
            return payment;
        });
        return {
            payments: transformedPayments,
            total,
            page: pageNum,
            totalPages: Math.ceil(total / limitNum)
        };
    }
    async findOnePayment(id) {
        const payment = await this.prisma.payment.findUnique({
            where: { id },
            include: {
                client: true,
                session: true
            }
        });
        if (payment && payment.client) {
            return {
                ...payment,
                client: {
                    ...payment.client,
                    name: {
                        firstName: payment.client.firstName,
                        lastName: payment.client.lastName,
                    },
                    address: {
                        street: payment.client.street,
                        city: payment.client.city,
                        state: payment.client.state,
                        zipCode: payment.client.zipCode,
                    }
                }
            };
        }
        return payment;
    }
    async updatePaymentStatus(id, { status }) {
        const updatedPayment = await this.prisma.payment.update({
            where: { id },
            data: { status },
            include: {
                client: true,
                session: true,
            },
        });
        if (updatedPayment.client) {
            return {
                ...updatedPayment,
                client: {
                    ...updatedPayment.client,
                    name: {
                        firstName: updatedPayment.client.firstName,
                        lastName: updatedPayment.client.lastName,
                    },
                    address: {
                        street: updatedPayment.client.street,
                        city: updatedPayment.client.city,
                        state: updatedPayment.client.state,
                        zipCode: updatedPayment.client.zipCode,
                    }
                }
            };
        }
        return updatedPayment;
    }
    async removePayment(id) {
        return this.prisma.payment.delete({
            where: { id }
        });
    }
    async removeAllPayments() {
        await this.prisma.payment.deleteMany();
        return { message: 'All payments deleted successfully' };
    }
    async getTotalAmountPending() {
        const result = await this.prisma.payment.aggregate({
            where: { status: 'PENDING' },
            _sum: { amount: true }
        });
        return { totalAmount: result._sum.amount || 0 };
    }
    async getTotalAmountPaid() {
        const result = await this.prisma.payment.aggregate({
            where: { status: 'COMPLETED' },
            _sum: { amount: true }
        });
        return { totalAmount: result._sum.amount || 0 };
    }
    async getTotalAmountCancelled() {
        const result = await this.prisma.payment.aggregate({
            where: { status: 'CANCELLED' },
            _sum: { amount: true }
        });
        return { totalAmount: result._sum.amount || 0 };
    }
    async getTotalAmountRefunded() {
        const result = await this.prisma.payment.aggregate({
            where: { status: 'REFUNDED' },
            _sum: { amount: true }
        });
        return { totalAmount: result._sum.amount || 0 };
    }
};
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "createPayment", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "findAllPayments", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "findOnePayment", null);
__decorate([
    (0, common_1.Patch)(":id/status"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "updatePaymentStatus", null);
__decorate([
    (0, common_1.Delete)(":id"),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "removePayment", null);
__decorate([
    (0, common_1.Delete)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "removeAllPayments", null);
__decorate([
    (0, common_1.Get)("total-amount-pending"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "getTotalAmountPending", null);
__decorate([
    (0, common_1.Get)("total-amount-paid"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "getTotalAmountPaid", null);
__decorate([
    (0, common_1.Get)("total-amount-cancelled"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "getTotalAmountCancelled", null);
__decorate([
    (0, common_1.Get)("total-amount-refunded"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "getTotalAmountRefunded", null);
exports.PaymentController = PaymentController = __decorate([
    (0, common_1.Controller)("payments"),
    __metadata("design:paramtypes", [PrismaService_1.PrismaService])
], PaymentController);

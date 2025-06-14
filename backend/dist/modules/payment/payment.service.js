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
exports.PaymentService = void 0;
const common_1 = require("@nestjs/common");
const PaymentId_1 = require("../../shared/Payment/vo/PaymentId");
const PAYMENT_REPOSITORY = 'PAYMENT_REPOSITORY';
let PaymentService = class PaymentService {
    paymentRepository;
    constructor(paymentRepository) {
        this.paymentRepository = paymentRepository;
    }
    async createPayment(createPaymentDto) {
        const payment = {
            id: new PaymentId_1.PaymentId(crypto.randomUUID()),
            amount: createPaymentDto.amount,
            status: createPaymentDto.status,
            currency: createPaymentDto.currency,
            method: createPaymentDto.method,
            clientId: createPaymentDto.clientId,
            sessionId: createPaymentDto.sessionId,
            createdAt: new Date(),
        };
        await this.paymentRepository.create(payment);
        return payment;
    }
    async findPaymentById(id) {
        return this.paymentRepository.findById(id);
    }
    async deletePayment(id) {
        await this.paymentRepository.delete(id);
    }
    async findAllPayments() {
        return this.paymentRepository.findAll();
    }
    async deleteAllPayments() {
        await this.paymentRepository.deleteAll();
    }
};
exports.PaymentService = PaymentService;
exports.PaymentService = PaymentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(PAYMENT_REPOSITORY)),
    __metadata("design:paramtypes", [Object])
], PaymentService);
//# sourceMappingURL=payment.service.js.map
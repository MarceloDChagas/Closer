"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentModule = void 0;
const common_1 = require("@nestjs/common");
const payment_controller_1 = require("./payment.controller");
const payment_service_1 = require("./payment.service");
const PrismaService_1 = require("../../repositories/PrismaService");
const PostgresPaymentRepository_1 = require("../../repositories/Postgres/PostgresPaymentRepository");
const PAYMENT_REPOSITORY = 'PAYMENT_REPOSITORY';
let PaymentModule = exports.PaymentModule = class PaymentModule {
};
exports.PaymentModule = PaymentModule = __decorate([
    (0, common_1.Module)({
        controllers: [payment_controller_1.PaymentController],
        providers: [
            PrismaService_1.PrismaService,
            payment_service_1.PaymentService,
            {
                provide: PAYMENT_REPOSITORY,
                useClass: PostgresPaymentRepository_1.PostgresPaymentRepository,
            },
        ],
        exports: [PAYMENT_REPOSITORY, payment_service_1.PaymentService],
    })
], PaymentModule);

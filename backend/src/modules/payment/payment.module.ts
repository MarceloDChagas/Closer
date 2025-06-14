import { Module } from "@nestjs/common";
import { PaymentController } from "./payment.controller";
import { PaymentService } from "./payment.service";
import { PrismaService } from "../../repositories/PrismaService";
import { PostgresPaymentRepository } from "../../repositories/Postgres/PostgresPaymentRepository";

const PAYMENT_REPOSITORY = 'PAYMENT_REPOSITORY';

@Module({
  controllers: [PaymentController],
  providers: [
    PrismaService,
    PaymentService,
    {
      provide: PAYMENT_REPOSITORY,
      useClass: PostgresPaymentRepository,
    },
  ],
  exports: [PAYMENT_REPOSITORY, PaymentService],
})
export class PaymentModule {}

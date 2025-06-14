import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  HttpStatus,
  HttpCode,
  NotFoundException,
} from "@nestjs/common";
import { PaymentService } from "./payment.service";
import { CreatePaymentDto } from "../../shared/Payment/dto/CreatePaymentDto";
import { PaymentStatus } from "../../shared/Payment/enums/EPaymentStatus";
import { PaymentResponseDto } from "../../shared/Payment/dto/PaymentResponseDto";

@Controller("payments")
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createPayment(@Body() createPaymentDto: CreatePaymentDto) {
    const payment = await this.paymentService.createPayment(createPaymentDto);
    return PaymentResponseDto.fromDomain(payment);
  }

  @Get()
  async findAllPayments() {
    const payments = await this.paymentService.findAllPayments();
    return payments.map(payment => PaymentResponseDto.fromDomain(payment));
  }

  @Get(":id")
  async findPaymentById(@Param("id") id: string) {
    const payment = await this.paymentService.findPaymentById(id);
    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }
    return PaymentResponseDto.fromDomain(payment);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePayment(@Param("id") id: string) {
    const payment = await this.paymentService.findPaymentById(id);
    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }
    await this.paymentService.deletePayment(id);
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAllPayments() {
    await this.paymentService.deleteAllPayments();
  }
}

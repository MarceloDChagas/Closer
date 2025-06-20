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
  Query,
  Patch,
} from "@nestjs/common";
import { PrismaService } from '../../repositories/PrismaService';

@Controller("payments")
export class PaymentController {
  constructor(private readonly prisma: PrismaService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createPayment(@Body() createPaymentData: {
    amount: number;
    currency: string;
    status: string;
    method: string;
    dueDate?: string;
    clientId: string;
    sessionId?: string;
  }) {
    const paymentData: any = {
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

  @Get()
  async findAllPayments(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: string
  ) {
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

  @Get(":id")
  async findOnePayment(@Param("id") id: string) {
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

  @Patch(":id/status")
  async updatePaymentStatus(
    @Param("id") id: string,
    @Body() { status }: { status: string },
  ) {
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

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async removePayment(@Param("id") id: string) {
    return this.prisma.payment.delete({
      where: { id }
    });
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeAllPayments() {
    await this.prisma.payment.deleteMany();
    return { message: 'All payments deleted successfully' };
  }

  @Get("total-amount-pending")
  async getTotalAmountPending() {
    const result = await this.prisma.payment.aggregate({
      where: { status: 'PENDING' },
      _sum: { amount: true }
    });
    return { totalAmount: result._sum.amount || 0 };
  }

  @Get("total-amount-paid")
  async getTotalAmountPaid() {
    const result = await this.prisma.payment.aggregate({
      where: { status: 'COMPLETED' },
      _sum: { amount: true }
    });
    return { totalAmount: result._sum.amount || 0 };
  }

  @Get("total-amount-cancelled")
  async getTotalAmountCancelled() {
    const result = await this.prisma.payment.aggregate({
      where: { status: 'CANCELLED' },
      _sum: { amount: true }
    });
    return { totalAmount: result._sum.amount || 0 };
  }

  @Get("total-amount-refunded")
  async getTotalAmountRefunded() {
    const result = await this.prisma.payment.aggregate({
      where: { status: 'REFUNDED' },
      _sum: { amount: true }
    });
    return { totalAmount: result._sum.amount || 0 };
  }
}

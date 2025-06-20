import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  HttpStatus,
  HttpCode,
  Query,
  Res,
} from "@nestjs/common";
import { PrismaService } from '../../repositories/PrismaService';
import { Response } from 'express';

@Controller("invoices")
export class InvoiceController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async findAllInvoices(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: string,
    @Query('clientId') clientId?: string
  ) {
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};
    if (status) where.status = status;
    if (clientId) where.clientId = clientId;

    // As "faturas" são baseadas em sessões que têm pagamentos associados
    const [sessions, total] = await Promise.all([
      this.prisma.session.findMany({
        where,
        skip,
        take: limitNum,
        include: {
          client: true,
          payment: true
        },
        orderBy: { createdAt: 'desc' }
      }),
      this.prisma.session.count({ where })
    ]);

    // Transformar sessões em "faturas"
    const invoices = sessions.map(session => ({
      id: session.id,
      number: `INV-${session.id.slice(-8).toUpperCase()}`,
      amount: session.payment?.amount || 0,
      status: session.payment?.status || 'PENDING',
      dueDate: session.payment?.dueDate || session.date,
      issueDate: session.createdAt,
      clientId: session.clientId,
      client: session.client,
      sessionId: session.id,
      description: `Sessão de ${session.serviceType}`,
      serviceType: session.serviceType,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt
    }));

    return {
      invoices,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum)
    };
  }

  @Get(":id")
  async findOneInvoice(@Param("id") id: string) {
    const session = await this.prisma.session.findUnique({
      where: { id },
      include: {
        client: true,
        payment: true
      }
    });

    if (!session) {
      return null;
    }

    return {
      id: session.id,
      number: `INV-${session.id.slice(-8).toUpperCase()}`,
      amount: session.payment?.amount || 0,
      status: session.payment?.status || 'PENDING',
      dueDate: session.payment?.dueDate || session.date,
      issueDate: session.createdAt,
      clientId: session.clientId,
      client: session.client,
      sessionId: session.id,
      description: `Sessão de ${session.serviceType}`,
      serviceType: session.serviceType,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt
    };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createInvoice(@Body() createInvoiceData: {
    sessionId: string;
    amount: number;
    dueDate?: string;
    description?: string;
  }) {
    // Criar um pagamento para a sessão (que representa a fatura)
    const session = await this.prisma.session.findUnique({
      where: { id: createInvoiceData.sessionId },
      include: { client: true }
    });

    if (!session) {
      throw new Error('Sessão não encontrada');
    }

    const payment = await this.prisma.payment.create({
      data: {
        amount: createInvoiceData.amount,
        currency: 'BRL',
        status: 'PENDING',
        method: 'PENDING',
        dueDate: createInvoiceData.dueDate ? new Date(createInvoiceData.dueDate) : session.date,
        clientId: session.clientId,
        sessionId: session.id
      },
      include: {
        client: true,
        session: true
      }
    });

    return {
      id: session.id,
      number: `INV-${session.id.slice(-8).toUpperCase()}`,
      amount: payment.amount,
      status: payment.status,
      dueDate: payment.dueDate,
      issueDate: payment.createdAt,
      clientId: session.clientId,
      client: session.client,
      sessionId: session.id,
      description: createInvoiceData.description || `Sessão de ${session.serviceType}`,
      serviceType: session.serviceType,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt
    };
  }

  @Patch(":id/status")
  async updateInvoiceStatus(@Param("id") id: string, @Body() { status }: { status: string }) {
    // Atualizar o status do pagamento associado à sessão
    const payment = await this.prisma.payment.findFirst({
      where: { sessionId: id }
    });

    if (!payment) {
      throw new Error('Pagamento não encontrado para esta fatura');
    }

    const updatedPayment = await this.prisma.payment.update({
      where: { id: payment.id },
      data: { status },
      include: {
        client: true,
        session: true
      }
    });

    return {
      id: updatedPayment.sessionId,
      status: updatedPayment.status,
      updatedAt: updatedPayment.updatedAt
    };
  }

  @Get(":id/pdf")
  async generateInvoicePdf(@Param("id") id: string, @Res() res: Response) {
    // Simular geração de PDF
    const invoice = await this.findOneInvoice(id);
    
    if (!invoice) {
      return res.status(404).json({ error: 'Fatura não encontrada' });
    }

    // Por enquanto, retornar um PDF simples
    const pdfContent = `
      FATURA ${invoice.number}
      
      Cliente: ${invoice.client.firstName} ${invoice.client.lastName}
      Serviço: ${invoice.description}
      Valor: R$ ${invoice.amount.toFixed(2)}
      Vencimento: ${new Date(invoice.dueDate).toLocaleDateString('pt-BR')}
      Status: ${invoice.status}
    `;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="fatura-${invoice.number}.pdf"`);
    res.send(Buffer.from(pdfContent, 'utf-8'));
  }

  @Post(":id/send-email")
  async sendInvoiceByEmail(@Param("id") id: string, @Body() { email }: { email: string }) {
    // Simular envio de email
    return {
      message: `Fatura enviada para ${email}`,
      success: true
    };
  }

  @Post(":id/send-whatsapp")
  async sendInvoiceByWhatsapp(@Param("id") id: string, @Body() { phone }: { phone: string }) {
    // Simular envio de WhatsApp
    return {
      message: `Fatura enviada via WhatsApp para ${phone}`,
      success: true
    };
  }
} 
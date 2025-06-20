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
exports.InvoiceController = void 0;
const common_1 = require("@nestjs/common");
const PrismaService_1 = require("../../repositories/PrismaService");
let InvoiceController = exports.InvoiceController = class InvoiceController {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAllInvoices(page, limit, status, clientId) {
        const pageNum = parseInt(page) || 1;
        const limitNum = parseInt(limit) || 10;
        const skip = (pageNum - 1) * limitNum;
        const where = {};
        if (status)
            where.status = status;
        if (clientId)
            where.clientId = clientId;
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
    async findOneInvoice(id) {
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
    async createInvoice(createInvoiceData) {
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
    async updateInvoiceStatus(id, { status }) {
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
    async generateInvoicePdf(id, res) {
        const invoice = await this.findOneInvoice(id);
        if (!invoice) {
            return res.status(404).json({ error: 'Fatura não encontrada' });
        }
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
    async sendInvoiceByEmail(id, { email }) {
        return {
            message: `Fatura enviada para ${email}`,
            success: true
        };
    }
    async sendInvoiceByWhatsapp(id, { phone }) {
        return {
            message: `Fatura enviada via WhatsApp para ${phone}`,
            success: true
        };
    }
};
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('status')),
    __param(3, (0, common_1.Query)('clientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], InvoiceController.prototype, "findAllInvoices", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InvoiceController.prototype, "findOneInvoice", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InvoiceController.prototype, "createInvoice", null);
__decorate([
    (0, common_1.Patch)(":id/status"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], InvoiceController.prototype, "updateInvoiceStatus", null);
__decorate([
    (0, common_1.Get)(":id/pdf"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], InvoiceController.prototype, "generateInvoicePdf", null);
__decorate([
    (0, common_1.Post)(":id/send-email"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], InvoiceController.prototype, "sendInvoiceByEmail", null);
__decorate([
    (0, common_1.Post)(":id/send-whatsapp"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], InvoiceController.prototype, "sendInvoiceByWhatsapp", null);
exports.InvoiceController = InvoiceController = __decorate([
    (0, common_1.Controller)("invoices"),
    __metadata("design:paramtypes", [PrismaService_1.PrismaService])
], InvoiceController);

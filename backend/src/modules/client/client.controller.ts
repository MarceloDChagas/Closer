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
  } from "@nestjs/common";
import { PrismaService } from '../../repositories/PrismaService';
import { CreateClientDto } from '../../shared/Client/dto/CreateClientDto';
  
  @Controller("clients")
  export class ClientController {
    constructor(private readonly prisma: PrismaService) {}
  
      @Post()
  @HttpCode(HttpStatus.CREATED)
  async createClient(@Body() createClientDto: CreateClientDto) {
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

    @Get()
    async findAllClients(
      @Query('page') page?: string,
      @Query('limit') limit?: string
    ) {
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

      // Transform the data to match frontend expectations
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

    @Get("stats/quantity")
    async getClientsQuantity() {
      const count = await this.prisma.client.count();
      return { quantity: count };
    }

    @Get("stats/new-this-month")
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

    @Get("with-owing-money")
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

    @Get(":id")
    async findOneClient(@Param("id") id: string) {
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
        throw new NotFoundException(`Client with ID ${id} not found`);
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

    @Get(":id/sessions")
    async getClientSessions(@Param("id") id: string) {
      return this.prisma.session.findMany({
        where: { clientId: id },
        include: {
          payment: true
        },
        orderBy: { date: 'desc' }
      });
    }
  
    @Delete(":id")
    @HttpCode(HttpStatus.NO_CONTENT)
    async removeClient(@Param("id") id: string) {
      // Verifica se há sessões associadas
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

    @Delete()
    @HttpCode(HttpStatus.NO_CONTENT)
    async removeAllClients() {
      // Remove payments e sessions primeiro devido às foreign keys
      await this.prisma.payment.deleteMany();
      await this.prisma.session.deleteMany();
      await this.prisma.client.deleteMany();
      
      return { message: 'All clients deleted successfully' };
    }
  }
  
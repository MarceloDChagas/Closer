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
  import { ClientService } from "./client.service";
  import { CreateClientDto } from "@shared/Client/dto/CreateClientDto";
  import { ClientResponseDto } from "@shared/Client/dto/ClientResponseDto";
  import { EPaymentMethod } from "../../shared/Payment/enums/EPaymentMethod";
  
  @Controller("clients")
  export class ClientController {
    constructor(private readonly clientService: ClientService) {}
  
    @Post()
    @HttpCode(HttpStatus.CREATED)
    async createClient(@Body() createClientDto: CreateClientDto) {
      const client = await this.clientService.createClient(createClientDto);
      return ClientResponseDto.fromDomain(client);
    }

    @Get()
    async findAllClients(@Query('paymentMethod') paymentMethod?: EPaymentMethod) {
      const clients = await this.clientService.findAllClients(paymentMethod);
      return clients.map(client => ClientResponseDto.fromDomain(client));
    }

    @Get(":id")
    async findClientById(@Param("id") id: string) {
      const client = await this.clientService.findClientById(id);
      if (!client) {
        throw new NotFoundException(`Client with ID ${id} not found`);
      }
      return ClientResponseDto.fromDomain(client);
    }
  
    @Delete(":id")
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteClient(@Param("id") id: string) {
      const client = await this.clientService.findClientById(id);
      if (!client) {
        throw new NotFoundException(`Client with ID ${id} not found`);
      }
      await this.clientService.deleteClient(id);
    }

    @Delete()
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteAllClients() {
      await this.clientService.deleteAllClients();
    }
  }
  
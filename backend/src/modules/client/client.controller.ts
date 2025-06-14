import {
    Controller,
    Post,
    Get,
    Delete,
    Body,
    Param,
    HttpStatus,
    HttpCode,
  } from "@nestjs/common";
  import { ClientService } from "./client.service";
  import { CreateClientDto } from "@shared/Client/dto/CreateClientDto";
  
  @Controller("clients")
  export class ClientController {
    constructor(private readonly clientService: ClientService) {}
  
    @Post()
    @HttpCode(HttpStatus.CREATED)
    async createClient(@Body() createClientDto: CreateClientDto) {
      const client = await this.clientService.createClient(createClientDto);
      return {
        id: client.id.value,
        name: {
          firstName: client.name.firstName,
          lastName: client.name.lastName,
        },
        email: client.email.value,
        phone: client.phone.value,
        address: {
          street: client.address.street,
          city: client.address.city,
          state: client.address.state,
          zipCode: client.address.zipCode,
        },
      };
    }

    @Get()
    async findAllClients() {
      console.log("findAllClients");  
      const clients = await this.clientService.findAllClients();
      return clients.map(client => ({
        id: client.id.value,
        name: {
          firstName: client.name.firstName,
          lastName: client.name.lastName,
        },
        email: client.email.value,
        phone: client.phone.value,
        address: {
          street: client.address.street,
          city: client.address.city,
          state: client.address.state,
          zipCode: client.address.zipCode,
        },
      }));
    }

    @Get(":id")
    async findClientById(@Param("id") id: string) {
      const client = await this.clientService.findClientById(id);
      if (!client) {
        return null;
      }
  
      return {
        id: client.id.value,
        name: {
          firstName: client.name.firstName,
          lastName: client.name.lastName,
        },
        email: client.email.value,
        phone: client.phone.value,
        address: {
          street: client.address.street,
          city: client.address.city,
          state: client.address.state,
          zipCode: client.address.zipCode,
        },
      };
    }
  
    @Delete(":id")
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteClient(@Param("id") id: string) {
      await this.clientService.deleteClient(id);
    }
  }
  
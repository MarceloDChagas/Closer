import { Injectable, Inject, BadRequestException } from "@nestjs/common";
import { IClientRepository } from "../../repositories/IClientRepository";
import { Client } from "@shared/Client/types/Client";
import { CreateClientDto } from "@shared/Client/dto/CreateClientDto";
import { Name } from "@shared/Client/vo/Name";
import { Email } from "@shared/Client/vo/Email";
import { Phone } from "@shared/Client/vo/Phone";
import { Address } from "@shared/Client/vo/Address";
import { ClientId } from "@shared/Client/vo/ClientId";

const CLIENT_REPOSITORY = 'CLIENT_REPOSITORY';

@Injectable()
export class ClientService {
  constructor(
    @Inject(CLIENT_REPOSITORY)
    private readonly clientRepository: IClientRepository
  ) {}

  async createClient(createClientDto: CreateClientDto): Promise<Client> {
    const client: Client = {
      id: new ClientId(),
      name: new Name(createClientDto.firstName, createClientDto.lastName),
      email: new Email(createClientDto.email),
      phone: new Phone(createClientDto.phone),
      address: new Address(
        createClientDto.street,
        createClientDto.city,
        createClientDto.state,
        createClientDto.zipCode
      ),
    };

    await this.clientRepository.save(client);
    return client;
  }

  async findClientById(id: string): Promise<Client | null> {
    return this.clientRepository.findById(id);
  }

  async findClientByEmail(email: string): Promise<Client | null> {
    return this.clientRepository.findByEmail(email);
  }

  async findClientByPhone(phone: string): Promise<Client | null> {
    return this.clientRepository.findByPhone(phone);
  }

  async deleteClient(id: string): Promise<void> {
    await this.clientRepository.delete(id);
  }

  async findAllClients(): Promise<Client[]> {
    return this.clientRepository.findAll();
  }

  async deleteAllClients(): Promise<void> {
    await this.clientRepository.deleteAll();
  }
}

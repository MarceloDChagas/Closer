import { Injectable, Inject } from "@nestjs/common";
import { IClientRepository } from "../../repositories/IClientRepository";
import { Client } from "@shared/Client/types/Client";
import { CreateClientDto } from "@shared/Client/dto/CreateClientDto";
import { Name } from "@shared/Client/vo/Name";
import { Email } from "@shared/Client/vo/Email";
import { Phone } from "@shared/Client/vo/Phone";
import { Address } from "@shared/Client/vo/Address";
import { ClientId } from "@shared/Client/vo/ClientId";
import { EPaymentMethod } from "../../shared/Payment/enums/EPaymentMethod";

const CLIENT_REPOSITORY = 'CLIENT_REPOSITORY';

@Injectable()
export class ClientService {
  constructor(
    @Inject(CLIENT_REPOSITORY)
    private readonly clientRepository: IClientRepository
  ) {}

  async createClient(createClientDto: CreateClientDto): Promise<Client> {
    const name = new Name(createClientDto.name.firstName, createClientDto.name.lastName);
    const email = new Email(createClientDto.email);
    const phone = new Phone(createClientDto.phone);
    const address = new Address(
      createClientDto.address.street,
      createClientDto.address.city,
      createClientDto.address.state,
      createClientDto.address.zipCode
    );

    const client: Client = {
      id: new ClientId(crypto.randomUUID()),
      name,
      email,
      phone,
      address,
    };

    await this.clientRepository.create(client);
    return client;
  }

  async findClientById(id: string): Promise<Client | null> {
    return this.clientRepository.findById(id);
  }

  async deleteClient(id: string): Promise<void> {
    await this.clientRepository.delete(id);
  }

  async findAllClients(paymentMethod?: EPaymentMethod): Promise<Client[]> {
    return this.clientRepository.findAll(paymentMethod);
  }

  async deleteAllClients(): Promise<void> {
    await this.clientRepository.deleteAll();
  }
}

import { Prisma } from "@prisma/client";
import { Client } from "@shared/Client/types/Client";
import { Name } from "@shared/Client/vo/Name";
import { Email } from "@shared/Client/vo/Email";
import { Phone } from "@shared/Client/vo/Phone";
import { Address } from "@shared/Client/vo/Address";
import { ClientId } from "@shared/Client/vo/ClientId";

export class ClientMapper {
  static toDomain(prismaClient: any): Client {
    return {
      id: new ClientId(prismaClient.id),
      name: new Name(prismaClient.firstName, prismaClient.lastName),
      email: new Email(prismaClient.email),
      phone: new Phone(prismaClient.phone),
      address: new Address(
        prismaClient.street,
        prismaClient.city,
        prismaClient.state,
        prismaClient.zipCode
      ),
    };
  }

  static toPrisma(client: Client): any {
    return {
      id: client.id.value,
      firstName: client.name.firstName,
      lastName: client.name.lastName,
      email: client.email.value,
      phone: client.phone.value,
      street: client.address.street,
      city: client.address.city,
      state: client.address.state,
      zipCode: client.address.zipCode,
    };
  }
} 
import { Client } from "../../../shared/Client/types/Client";
import { ClientId } from "../../../shared/Client/vo/ClientId";
import { Name } from "../../../shared/Client/vo/Name";
import { Email } from "../../../shared/Client/vo/Email";
import { Phone } from "../../../shared/Client/vo/Phone";
import { Address } from "../../../shared/Client/vo/Address";

type PrismaClient = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  createdAt: Date;
  updatedAt: Date;
  payments?: any[];
};

export function mapToPrisma(client: Client): Omit<PrismaClient, "id" | "createdAt" | "updatedAt"> {
  return {
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

export function mapToDomain(client: PrismaClient): Client {
  return {
    id: new ClientId(client.id),
    name: new Name(client.firstName, client.lastName),
    email: new Email(client.email),
    phone: new Phone(client.phone),
    address: new Address(
      client.street,
      client.city,
      client.state,
      client.zipCode
    ),
  };
} 
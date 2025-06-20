import { Client } from "@shared/Client/types/Client";
import { ClientId } from "../../../shared/Client/vo/ClientId";
import { Name } from "../../../shared/Client/vo/Name";
import { Email } from "../../../shared/Client/vo/Email";
import { Phone } from "../../../shared/Client/vo/Phone";
import { Address } from "../../../shared/Client/vo/Address";
import { Payment } from "@shared/Payment/types/Payment";
import { Session } from "@shared/Session/types/Session";

export class ClientMapper {
  static toDomain(client: any): Client {
    return {
      id: new ClientId(client.id),
      name: new Name(client.name.firstName, client.name.lastName),
      email: new Email(client.email),
      phone: new Phone(client.phone),
      address: new Address(
        client.address.street,
        client.address.city,
        client.address.state,
        client.address.zipCode
      ),
    };
  }

  static toPersistence(client: Client): any {
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
} 
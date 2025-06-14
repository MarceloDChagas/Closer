import { Client } from "../types/Client";
import { Expose } from "class-transformer";
import { ClientId } from "../vo/ClientId";
import { Name } from "../vo/Name";
import { Email } from "../vo/Email";
import { Phone } from "../vo/Phone";
import { Address } from "../vo/Address";

export class ClientResponseDto {
  @Expose()
  id!: ClientId;

  @Expose()
  name!: Name;

  @Expose()
  email!: Email;

  @Expose()
  phone!: Phone;

  @Expose()
  address!: Address;

  static fromDomain(client: Client): ClientResponseDto {
    const dto = new ClientResponseDto();
    dto.id = client.id;
    dto.name = client.name;
    dto.email = client.email;
    dto.phone = client.phone;
    dto.address = client.address;
    return dto;
  }
} 
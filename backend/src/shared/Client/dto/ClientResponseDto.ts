import { Client } from '../types/Client';

export class ClientResponseDto {
  id: string;
  name: {
    firstName: string;
    lastName: string;
  };
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };

  static fromDomain(client: Client): ClientResponseDto {
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
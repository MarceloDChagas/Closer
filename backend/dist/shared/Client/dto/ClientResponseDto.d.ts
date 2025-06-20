import { Client } from '../types/Client';
export declare class ClientResponseDto {
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
    static fromDomain(client: Client): ClientResponseDto;
}

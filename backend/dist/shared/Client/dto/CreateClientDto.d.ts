import "reflect-metadata";
declare class NameDto {
    firstName: string;
    lastName: string;
}
declare class AddressDto {
    street: string;
    city: string;
    state: string;
    zipCode: string;
}
export declare class CreateClientDto {
    name: NameDto;
    email: string;
    phone: string;
    address: AddressDto;
}
export {};

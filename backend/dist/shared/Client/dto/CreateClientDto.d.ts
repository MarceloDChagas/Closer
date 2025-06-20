export declare class NameDto {
    firstName: string;
    lastName: string;
}
export declare class AddressDto {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
}
export declare class CreateClientDto {
    name: NameDto;
    email: string;
    phone: string;
    address?: AddressDto;
}

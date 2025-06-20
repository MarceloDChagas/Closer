"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientResponseDto = void 0;
class ClientResponseDto {
    static fromDomain(client) {
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
exports.ClientResponseDto = ClientResponseDto;

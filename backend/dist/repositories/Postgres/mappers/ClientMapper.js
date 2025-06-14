"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientMapper = void 0;
const Name_1 = require("../../../shared/Client/vo/Name");
const Email_1 = require("../../../shared/Client/vo/Email");
const Phone_1 = require("../../../shared/Client/vo/Phone");
const Address_1 = require("../../../shared/Client/vo/Address");
const ClientId_1 = require("../../../shared/Client/vo/ClientId");
class ClientMapper {
    static toDomain(prismaClient) {
        return {
            id: new ClientId_1.ClientId(prismaClient.id),
            name: new Name_1.Name(prismaClient.firstName, prismaClient.lastName),
            email: new Email_1.Email(prismaClient.email),
            phone: new Phone_1.Phone(prismaClient.phone),
            address: new Address_1.Address(prismaClient.street, prismaClient.city, prismaClient.state, prismaClient.zipCode),
        };
    }
    static toPrisma(client) {
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
exports.ClientMapper = ClientMapper;
//# sourceMappingURL=ClientMapper.js.map
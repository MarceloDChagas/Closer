"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientMapper = void 0;
const ClientId_1 = require("../../../shared/Client/vo/ClientId");
const Name_1 = require("../../../shared/Client/vo/Name");
const Email_1 = require("../../../shared/Client/vo/Email");
const Phone_1 = require("../../../shared/Client/vo/Phone");
const Address_1 = require("../../../shared/Client/vo/Address");
class ClientMapper {
    static toDomain(client) {
        return {
            id: new ClientId_1.ClientId(client.id),
            name: new Name_1.Name(client.name.firstName, client.name.lastName),
            email: new Email_1.Email(client.email),
            phone: new Phone_1.Phone(client.phone),
            address: new Address_1.Address(client.address.street, client.address.city, client.address.state, client.address.zipCode),
        };
    }
    static toPersistence(client) {
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
exports.ClientMapper = ClientMapper;

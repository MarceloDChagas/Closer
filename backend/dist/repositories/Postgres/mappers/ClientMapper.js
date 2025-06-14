"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapToPrisma = mapToPrisma;
exports.mapToDomain = mapToDomain;
const ClientId_1 = require("../../../shared/Client/vo/ClientId");
const Name_1 = require("../../../shared/Client/vo/Name");
const Email_1 = require("../../../shared/Client/vo/Email");
const Phone_1 = require("../../../shared/Client/vo/Phone");
const Address_1 = require("../../../shared/Client/vo/Address");
function mapToPrisma(client) {
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
function mapToDomain(client) {
    return {
        id: new ClientId_1.ClientId(client.id),
        name: new Name_1.Name(client.firstName, client.lastName),
        email: new Email_1.Email(client.email),
        phone: new Phone_1.Phone(client.phone),
        address: new Address_1.Address(client.street, client.city, client.state, client.zipCode),
    };
}
//# sourceMappingURL=ClientMapper.js.map
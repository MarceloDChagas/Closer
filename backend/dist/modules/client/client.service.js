"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientService = void 0;
const common_1 = require("@nestjs/common");
const Name_1 = require("../../shared/Client/vo/Name");
const Email_1 = require("../../shared/Client/vo/Email");
const Phone_1 = require("../../shared/Client/vo/Phone");
const Address_1 = require("../../shared/Client/vo/Address");
const ClientId_1 = require("../../shared/Client/vo/ClientId");
const CLIENT_REPOSITORY = 'CLIENT_REPOSITORY';
let ClientService = class ClientService {
    clientRepository;
    constructor(clientRepository) {
        this.clientRepository = clientRepository;
    }
    async createClient(createClientDto) {
        const name = new Name_1.Name(createClientDto.name.firstName, createClientDto.name.lastName);
        const email = new Email_1.Email(createClientDto.email);
        const phone = new Phone_1.Phone(createClientDto.phone);
        const address = new Address_1.Address(createClientDto.address.street, createClientDto.address.city, createClientDto.address.state, createClientDto.address.zipCode);
        const client = {
            id: new ClientId_1.ClientId(crypto.randomUUID()),
            name,
            email,
            phone,
            address,
        };
        await this.clientRepository.create(client);
        return client;
    }
    async findClientById(id) {
        return this.clientRepository.findById(id);
    }
    async deleteClient(id) {
        await this.clientRepository.delete(id);
    }
    async findAllClients(paymentMethod) {
        return this.clientRepository.findAll(paymentMethod);
    }
    async deleteAllClients() {
        await this.clientRepository.deleteAll();
    }
};
exports.ClientService = ClientService;
exports.ClientService = ClientService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(CLIENT_REPOSITORY)),
    __metadata("design:paramtypes", [Object])
], ClientService);
//# sourceMappingURL=client.service.js.map
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
exports.ClientController = void 0;
const common_1 = require("@nestjs/common");
const client_service_1 = require("./client.service");
const CreateClientDto_1 = require("../../shared/Client/dto/CreateClientDto");
let ClientController = class ClientController {
    clientService;
    constructor(clientService) {
        this.clientService = clientService;
    }
    async createClient(createClientDto) {
        const client = await this.clientService.createClient(createClientDto);
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
    async findAllClients() {
        console.log("findAllClients");
        const clients = await this.clientService.findAllClients();
        return clients.map(client => ({
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
        }));
    }
    async findClientById(id) {
        const client = await this.clientService.findClientById(id);
        if (!client) {
            return null;
        }
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
    async deleteClient(id) {
        await this.clientService.deleteClient(id);
    }
};
exports.ClientController = ClientController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateClientDto_1.CreateClientDto]),
    __metadata("design:returntype", Promise)
], ClientController.prototype, "createClient", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ClientController.prototype, "findAllClients", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ClientController.prototype, "findClientById", null);
__decorate([
    (0, common_1.Delete)(":id"),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ClientController.prototype, "deleteClient", null);
exports.ClientController = ClientController = __decorate([
    (0, common_1.Controller)("clients"),
    __metadata("design:paramtypes", [client_service_1.ClientService])
], ClientController);
//# sourceMappingURL=client.controller.js.map
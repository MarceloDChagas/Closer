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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientResponseDto = void 0;
const class_transformer_1 = require("class-transformer");
const ClientId_1 = require("../vo/ClientId");
const Name_1 = require("../vo/Name");
const Email_1 = require("../vo/Email");
const Phone_1 = require("../vo/Phone");
const Address_1 = require("../vo/Address");
class ClientResponseDto {
    id;
    name;
    email;
    phone;
    address;
    static fromDomain(client) {
        const dto = new ClientResponseDto();
        dto.id = client.id;
        dto.name = client.name;
        dto.email = client.email;
        dto.phone = client.phone;
        dto.address = client.address;
        return dto;
    }
}
exports.ClientResponseDto = ClientResponseDto;
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", ClientId_1.ClientId)
], ClientResponseDto.prototype, "id", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Name_1.Name)
], ClientResponseDto.prototype, "name", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Email_1.Email)
], ClientResponseDto.prototype, "email", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Phone_1.Phone)
], ClientResponseDto.prototype, "phone", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Address_1.Address)
], ClientResponseDto.prototype, "address", void 0);
//# sourceMappingURL=ClientResponseDto.js.map
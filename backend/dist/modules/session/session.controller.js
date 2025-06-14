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
exports.SessionController = void 0;
const common_1 = require("@nestjs/common");
const session_service_1 = require("./session.service");
const CreateSessionDto_1 = require("../../shared/Session/dto/CreateSessionDto");
const SessionResponseDto_1 = require("../../shared/Session/dto/SessionResponseDto");
let SessionController = class SessionController {
    sessionService;
    constructor(sessionService) {
        this.sessionService = sessionService;
    }
    async createSession(createSessionDto) {
        const session = await this.sessionService.createSession(createSessionDto);
        return SessionResponseDto_1.SessionResponseDto.fromDomain(session);
    }
    async findAllSessions() {
        const sessions = await this.sessionService.findAllSessions();
        return sessions.map(session => SessionResponseDto_1.SessionResponseDto.fromDomain(session));
    }
    async findSessionById(id) {
        const session = await this.sessionService.findSessionById(id);
        if (!session) {
            throw new common_1.NotFoundException(`Session with ID ${id} not found`);
        }
        return SessionResponseDto_1.SessionResponseDto.fromDomain(session);
    }
    async deleteSession(id) {
        const session = await this.sessionService.findSessionById(id);
        if (!session) {
            throw new common_1.NotFoundException(`Session with ID ${id} not found`);
        }
        await this.sessionService.deleteSession(id);
    }
    async deleteAllSessions() {
        await this.sessionService.deleteAllSessions();
    }
};
exports.SessionController = SessionController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateSessionDto_1.CreateSessionDto]),
    __metadata("design:returntype", Promise)
], SessionController.prototype, "createSession", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SessionController.prototype, "findAllSessions", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SessionController.prototype, "findSessionById", null);
__decorate([
    (0, common_1.Delete)(":id"),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SessionController.prototype, "deleteSession", null);
__decorate([
    (0, common_1.Delete)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SessionController.prototype, "deleteAllSessions", null);
exports.SessionController = SessionController = __decorate([
    (0, common_1.Controller)("sessions"),
    __metadata("design:paramtypes", [session_service_1.SessionService])
], SessionController);
//# sourceMappingURL=session.controller.js.map
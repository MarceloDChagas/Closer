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
exports.SessionService = void 0;
const common_1 = require("@nestjs/common");
const SystemClock_1 = require("../../shared/Session/vo/SystemClock");
const SessionId_1 = require("../../shared/Session/vo/SessionId");
const EPhotoDeliveryStatus_1 = require("../../shared/Session/enums/EPhotoDeliveryStatus");
const SESSION_REPOSITORY = 'SESSION_REPOSITORY';
let SessionService = exports.SessionService = class SessionService {
    constructor(sessionRepository) {
        this.sessionRepository = sessionRepository;
    }
    async createSession(createSessionDto) {
        const session = {
            id: new SessionId_1.SessionId(crypto.randomUUID()),
            date: new SystemClock_1.SystemClock(new Date(createSessionDto.date)),
            duration: createSessionDto.duration,
            status: createSessionDto.status,
            serviceType: createSessionDto.serviceType,
            photoDeliveryStatus: createSessionDto.photoDeliveryStatus || EPhotoDeliveryStatus_1.EPhotoDeliveryStatus.NOT_DELIVERED,
            clientId: createSessionDto.clientId,
        };
        await this.sessionRepository.create(session);
        return session;
    }
    async findSessionById(id) {
        return this.sessionRepository.findById(id);
    }
    async deleteSession(id) {
        await this.sessionRepository.delete(id);
    }
    async findAllSessions(filters) {
        return this.sessionRepository.findAll(filters);
    }
    async deleteAllSessions() {
        await this.sessionRepository.deleteAll();
    }
    async getQuantityOfSessions() {
        return this.sessionRepository.getQuantityOfSessions();
    }
    async getQuantityOfSessionsThisMonth() {
        return this.sessionRepository.getQuantityOfSessionsThisMonth();
    }
    async getQuantityOfPendingSessions() {
        return this.sessionRepository.getQuantityOfPendingSessions();
    }
    async getQuantityOfCompletedSessions() {
        return this.sessionRepository.getQuantityOfCompletedSessions();
    }
    async getQuantityOfCancelledSessions() {
        return this.sessionRepository.getQuantityOfCancelledSessions();
    }
    async getQuantityOfRefundedSessions() {
        return this.sessionRepository.getQuantityOfRefundedSessions();
    }
};
exports.SessionService = SessionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(SESSION_REPOSITORY)),
    __metadata("design:paramtypes", [Object])
], SessionService);

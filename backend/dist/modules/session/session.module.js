"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionModule = void 0;
const common_1 = require("@nestjs/common");
const session_controller_1 = require("./session.controller");
const session_service_1 = require("./session.service");
const PostgresSessionRepository_1 = require("../../repositories/Postgres/PostgresSessionRepository");
const PrismaService_1 = require("../../repositories/PrismaService");
const SESSION_REPOSITORY = 'SESSION_REPOSITORY';
let SessionModule = exports.SessionModule = class SessionModule {
};
exports.SessionModule = SessionModule = __decorate([
    (0, common_1.Module)({
        controllers: [session_controller_1.SessionController],
        providers: [
            session_service_1.SessionService,
            PrismaService_1.PrismaService,
            {
                provide: SESSION_REPOSITORY,
                useClass: PostgresSessionRepository_1.PostgresSessionRepository,
            },
        ],
        exports: [session_service_1.SessionService, PrismaService_1.PrismaService],
    })
], SessionModule);

import { Module } from "@nestjs/common";
import { SessionController } from "./session.controller";
import { SessionService } from "./session.service";
import { PostgresSessionRepository } from "../../repositories/Postgres/PostgresSessionRepository";
import { PrismaService } from "../../repositories/PrismaService";

const SESSION_REPOSITORY = 'SESSION_REPOSITORY';

@Module({
  controllers: [SessionController],
  providers: [
    SessionService,
    PrismaService,
    {
      provide: SESSION_REPOSITORY,
      useClass: PostgresSessionRepository,
    },
  ],
  exports: [SessionService, PrismaService],
})
export class SessionModule {}

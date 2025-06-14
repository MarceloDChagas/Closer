import { Module } from "@nestjs/common";
import { ClientController } from "./client.controller";
import { ClientService } from "./client.service";
import { PrismaService } from "../../repositories/PrismaService";
import { PostgresClientRepository } from "../../repositories/Postgres/PostgresClientRepository";

const CLIENT_REPOSITORY = 'CLIENT_REPOSITORY';

@Module({
  controllers: [ClientController],
  providers: [
    PrismaService,
    ClientService,
    {
      provide: CLIENT_REPOSITORY,
      useClass: PostgresClientRepository,
    },
  ],
  exports: [CLIENT_REPOSITORY, ClientService],
})
export class ClientModule {} 
import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { PrismaService } from '../../repositories/PrismaService';
import { PostgresClientRepository } from '../../repositories/Postgres/PostgresClientRepository';
import { PostgresSessionRepository } from '../../repositories/Postgres/PostgresSessionRepository';

@Module({
  controllers: [DashboardController],
  providers: [
    DashboardService, 
    PrismaService,
    {
      provide: 'CLIENT_REPOSITORY',
      useClass: PostgresClientRepository,
    },
    {
      provide: 'SESSION_REPOSITORY',
      useClass: PostgresSessionRepository,
    },
  ],
})
export class DashboardModule {} 
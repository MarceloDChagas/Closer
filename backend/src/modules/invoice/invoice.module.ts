import { Module } from '@nestjs/common';
import { InvoiceController } from './invoice.controller';
import { InvoiceService } from './invoice.service';
import { PrismaService } from '../../repositories/PrismaService';

@Module({
  controllers: [InvoiceController],
  providers: [InvoiceService, PrismaService],
  exports: [InvoiceService],
})
export class InvoiceModule {} 
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientModule } from './modules/client/client.module';
import { PaymentModule } from './modules/payment/payment.module';
import { SessionModule } from './modules/session/session.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { InvoiceModule } from './modules/invoice/invoice.module';
import { ReportModule } from './modules/report/report.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ClientModule,
    PaymentModule,
    SessionModule,
    DashboardModule,
    InvoiceModule,
    ReportModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

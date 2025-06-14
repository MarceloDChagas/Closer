import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { PrismaClientExceptionFilter } from './filters/PrismaClientExceptionFilter';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  console.log('antes do try');
  try {
    console.log('dentro do try');
    logger.log('Starting application...');

    const app = await NestFactory.create(AppModule, {
      logger: ['error', 'warn', 'log', 'debug', 'verbose'],
    });
    console.log('depois do app');
    app.enableCors();
    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalFilters(new PrismaClientExceptionFilter());
    console.log('depois do useGlobalPipes');
    const port = process.env.PORT ?? 3040;
    logger.log(`Attempting to start server on port ${port}...`);
    logger.log('PRE-LISTEN...');
    await app.listen(port);
    logger.log('POS-LISTEN...');

    logger.log('=================================');
    logger.log(`🚀 SERVER RUNNING ON PORT ${port}`);
    logger.log(`📝 API: http://localhost:${port}`);
    logger.log('=================================');

    // Keep the process running
    process.on('SIGTERM', () => {
      logger.log('SIGTERM received. Shutting down gracefully...');
      app.close();
    });
  } catch (error) {
    logger.error('Failed to start application:', error);
    process.exit(1);
  }
}

bootstrap().catch((err) => {
  console.error('Unhandled error during bootstrap:', err);
  process.exit(1);
});

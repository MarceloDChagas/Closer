import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { PrismaClientExceptionFilter } from './filters/PrismaClientExceptionFilter';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  try {
    logger.log('Starting application...');

    const app = await NestFactory.create(AppModule, {
      logger: ['error', 'warn', 'log', 'debug', 'verbose'],
    });
    app.enableCors();
    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalFilters(new PrismaClientExceptionFilter());
    const port = process.env.PORT ?? 3040;
    logger.log(`Attempting to start server on port ${port}...`);
    await app.listen(port);

    logger.log('=================================');
    logger.log(`SERVER RUNNING ON PORT ${port}`);
    logger.log(`API: http://localhost:${port}`);
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

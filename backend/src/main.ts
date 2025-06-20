import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './filters/HttpExceptionFilter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors();
  
  // Enable validation
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

  // Use global exception filter
  app.useGlobalFilters(new HttpExceptionFilter());

  const port = process.env.PORT || 3008;
  await app.listen(port);
  console.log(`=================================`);
  console.log(`SERVER RUNNING ON PORT ${port}`);
  console.log(`API: http://localhost:${port}`);
  console.log(`=================================`);
}
bootstrap();

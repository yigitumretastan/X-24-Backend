import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { setupSwagger } from './config/swagger.config';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());

  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  });
  app.use(cookieParser());

  // Swagger config burada tanımlı
  setupSwagger(app);

  const port = process.env.PORT || 5000;
  await app.listen(port);

  console.log(`🚀 Application running on http://localhost:${port}`);
  console.log(`📚 Swagger docs available at http://localhost:${port}/api-docs`);
}
bootstrap();

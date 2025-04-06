import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.use(cookieParser());

  app.use(helmet());
  app.enableCors({
    origin: true,
    credentials: process.env.CORS_CREDENTIALS === 'true',
  });

  await app.listen(process.env.APP_PORT ?? 3000);
}
bootstrap();

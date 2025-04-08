import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

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

  const config = new DocumentBuilder()
    .setTitle('Saas API')
    .setDescription('Saas API endpoints')
    .setVersion('1.0')
    .addTag('saas')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(
    process.env.SWAGGER_URL ?? '/api-docs',
    app,
    documentFactory,
  );
  await app.listen(process.env.APP_PORT ?? 3000);
}
bootstrap();

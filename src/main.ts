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
    origin: process.env.CORS_ORIGIN ?? 'https://www.thauan.site',
    credentials: true,
  });

  app.setGlobalPrefix(process.env.APP_PREFIX ?? 'api');

  const config = new DocumentBuilder()
    .setTitle('Saas API')
    .setDescription('Saas API endpoints')
    .setVersion('1.0')
    .addTag('saas')
    .addCookieAuth('jwt')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(
    process.env.SWAGGER_URL ?? '/api-docs',
    app,
    documentFactory,
  );
  await app.listen(process.env.APP_PORT ?? 3000);
}
bootstrap().catch((error) => {
  console.error('Error during application bootstrap:', error);
});

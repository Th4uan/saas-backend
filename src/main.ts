import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.use(cookieParser());

  const cache = app.get<Cache>(CACHE_MANAGER);

  await cache.set('ninja_key', 'salvo_via_nest', 120);
  const valor = await cache.get('ninja_key');
  console.log('⚡ Valor salvo:', valor);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

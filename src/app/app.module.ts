import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import appConfig from './app.config';
import { AuthModule } from 'src/auth/auth.module';
import { CacheModule } from '@nestjs/cache-manager';
import { UserModule } from 'src/user/user.module';
import { RedisClientOptions } from 'redis';
import { createKeyv, Keyv } from '@keyv/redis';
import { CacheableMemory } from 'cacheable';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { DayMiddleware } from 'src/middlewares/day-or-month.middleware';
import { ClientsModule } from 'src/clients/clients.module';
import { SupabaseModule } from 'src/supabase/supabase.module';
import { EncryptionModule } from 'src/common/utils/encryption/encryption.module';
import { ServicesModule } from 'src/services/services.module';
import { AppointmentModule } from 'src/appointment/appointment.module';
import { PaymentModule } from 'src/payment/payment.module';
import { AgreementModule } from 'src/agreement/agreement.module';
import { CertificateModule } from 'src/certificate/certificate.module';
import { StampModule } from 'src/stamp/stamp.module';

@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule.forFeature(appConfig)],
      inject: [appConfig.KEY],
      useFactory: (config: ConfigType<typeof appConfig>) => {
        return [
          {
            ttl: config.throttle.ttl,
            limit: config.throttle.limit,
            blockDuration: config.throttle.blockDuration,
          },
        ];
      },
    }),
    ConfigModule.forRoot({
      envFilePath: 'env/.env',
    }),
    ConfigModule.forFeature(appConfig),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forFeature(appConfig)],
      inject: [appConfig.KEY],
      useFactory: (config: ConfigType<typeof appConfig>) => {
        return {
          type: config.database.type,
          host: config.database.host,
          port: config.database.port,
          username: config.database.username,
          password: config.database.password,
          database: config.database.database,
          autoLoadEntities: config.database.autoLoadEntities,
          synchronize: true, // desativar depois
          timezone: 'America/Sao_Paulo',
        };
      },
    }),
    CacheModule.registerAsync<RedisClientOptions>({
      isGlobal: true,
      imports: [ConfigModule.forFeature(appConfig)],
      inject: [appConfig.KEY],
      useFactory: (config: ConfigType<typeof appConfig>) => {
        return {
          stores: [
            new Keyv({
              store: new CacheableMemory({
                ttl: config.cache.ttl,
                lruSize: config.cache.lruSize,
              }),
            }),
            createKeyv(config.cache.url),
          ],
        };
      },
    }),
    UserModule,
    AuthModule,
    ClientsModule,
    SupabaseModule,
    EncryptionModule,
    ServicesModule,
    AppointmentModule,
    PaymentModule,
    AgreementModule,
    CertificateModule,
    StampModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(DayMiddleware)
      .forRoutes({ path: 'services', method: RequestMethod.GET });
  }
}

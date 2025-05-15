import { Module } from '@nestjs/common';
import { ServicesService } from './services.service';
import { ServicesController } from './services.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from './entities/service.entity';
import { ClientsModule } from 'src/clients/clients.module';
import { UserModule } from 'src/user/user.module';
import { PaymentModule } from 'src/payment/payment.module';
import { AgreementModule } from 'src/agreement/agreement.module';
import { EncryptionModule } from 'src/common/utils/encryption/encryption.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Service]),
    ClientsModule,
    UserModule,
    PaymentModule,
    AgreementModule,
    EncryptionModule,
  ],
  controllers: [ServicesController],
  providers: [ServicesService],
  exports: [ServicesService],
})
export class ServicesModule {}

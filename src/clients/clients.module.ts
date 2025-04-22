import { Module } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ClientsController } from './clients.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { AddressModule } from 'src/address/address.module';
import { EncryptionModule } from 'src/common/utils/encryption/encryption.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Client]),
    AddressModule,
    EncryptionModule,
  ],
  controllers: [ClientsController],
  providers: [ClientsService],
  exports: [ClientsService],
})
export class ClientsModule {}

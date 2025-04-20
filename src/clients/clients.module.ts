import { Module } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ClientsController } from './clients.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { AddressModule } from 'src/address/address.module';

@Module({
  imports: [TypeOrmModule.forFeature([Client]), AddressModule],
  controllers: [ClientsController],
  providers: [ClientsService],
})
export class ClientsModule {}

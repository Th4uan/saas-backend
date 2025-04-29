import { Module } from '@nestjs/common';
import { AgreementService } from './agreement.service';
import { AgreementController } from './agreement.controller';
import { Agreement } from './entity/agreement.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Agreement])],
  controllers: [AgreementController],
  providers: [AgreementService],
  exports: [AgreementService],
})
export class AgreementModule {}

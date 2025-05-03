import { Module } from '@nestjs/common';
import { CertificateService } from './certificate.service';
import { CertificateController } from './certificate.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CertificateEntity } from './entity/certificate.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CertificateEntity])],
  controllers: [CertificateController],
  providers: [CertificateService],
  exports: [CertificateService],
})
export class CertificateModule {}

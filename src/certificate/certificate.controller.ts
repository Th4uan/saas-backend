import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { CertificateService } from './certificate.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('certificate')
export class CertificateController {
  constructor(private readonly certificateService: CertificateService) {}

  @UseInterceptors(FileInterceptor('certificate'))
  @Post()
  async insertCertificate(certificate: Express.Multer.File, password: string) {
    if (!certificate) {
      throw new Error('Certificate file is required');
    }
    return this.certificateService.insertCertificate(certificate, password);
  }

  @Get(':id')
  async getCertificateById(@Param('id') id: string) {
    if (id == null || id === '') {
      throw new Error('Certificate ID is required');
    }
    return this.certificateService.getCertificateById(id);
  }

  @Delete(':id')
  async deleteCertificate(@Param('id') id: string) {
    if (id == null || id === '') {
      throw new Error('Certificate ID is required');
    }
    return this.certificateService.deleteCertificate(id);
  }
}

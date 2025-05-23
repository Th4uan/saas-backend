import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  Body,
  UseInterceptors,
} from '@nestjs/common';
import { CertificateService } from './certificate.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CertificateDTO } from './dto/certificate.dto';

@Controller('certificate')
export class CertificateController {
  constructor(private readonly certificateService: CertificateService) {}

  @UseInterceptors(FileInterceptor('certificate'))
  @Post()
  async insertCertificate(
    @UploadedFile() certificate: Express.Multer.File,
    @Body() certificateDTO: CertificateDTO,
  ) {
    if (!certificate) throw new Error('Certificate file is required');

    return this.certificateService.insertCertificate(
      certificate,
      certificateDTO,
    );
  }

  @Get()
  async getAllCertificates() {
    return this.certificateService.getAllCertificates();
  }

  @Get(':id')
  async getCertificateById(@Param('id') id: string) {
    if (!id) {
      throw new Error('Certificate ID is required');
    }
    return this.certificateService.getCertificateById(id);
  }

  @Delete(':id')
  async deleteCertificate(@Param('id') id: string) {
    if (!id) {
      throw new Error('Certificate ID is required');
    }
    return this.certificateService.deleteCertificate(id);
  }
}

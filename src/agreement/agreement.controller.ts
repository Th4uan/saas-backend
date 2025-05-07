import { Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
import { AgreementService } from './agreement.service';
import { AuthTokenGuard } from 'src/auth/guards/auth-token.guard';

@UseGuards(AuthTokenGuard)
@Controller('agreement')
export class AgreementController {
  constructor(private readonly agreementService: AgreementService) {}

  @Post()
  async createAgreement(name: string) {
    if (!name) {
      throw new Error('Agreement name is required');
    }
    return this.agreementService.createAgreement(name);
  }

  @Get(':id')
  async getAgreementById(id: string) {
    if (id == null || id === '') {
      throw new Error('Agreement ID is required');
    }
    return this.agreementService.getAgreementById(id);
  }

  @Delete(':id')
  async deleteAgreement(id: string) {
    if (id == null || id === '') {
      throw new Error('Agreement ID is required');
    }
    return this.agreementService.deleteAgreement(id);
  }

  @Get()
  async getAllAgreements() {
    return this.agreementService.getAllAgreements();
  }
}

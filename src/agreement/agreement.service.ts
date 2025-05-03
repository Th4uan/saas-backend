import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Agreement } from './entity/agreement.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AgreementService {
  constructor(
    @InjectRepository(Agreement)
    private readonly agreementRepository: Repository<Agreement>,
  ) {}

  async createAgreement(name: string): Promise<Agreement> {
    const agreement = this.agreementRepository.create({ name });
    if (!agreement) {
      throw new BadRequestException('Error creating agreement');
    }
    await this.agreementRepository.save(agreement);

    return agreement;
  }

  async getAgreementById(id: string): Promise<Agreement> {
    if (id == null || id === '') {
      throw new BadRequestException('Agreement ID is required');
    }
    const agreement = await this.agreementRepository.findOne({
      where: { id },
    });

    if (!agreement) {
      throw new BadRequestException('Agreement not found');
    }

    return agreement;
  }

  async deleteAgreement(id: string): Promise<void> {
    if (id == null || id === '') {
      throw new BadRequestException('Agreement ID is required');
    }

    const agreement = await this.agreementRepository.findOne({
      where: { id },
    });

    if (!agreement) {
      throw new BadRequestException('Agreement not found');
    }

    await this.agreementRepository.remove(agreement);
  }
}

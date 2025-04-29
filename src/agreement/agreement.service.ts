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
}

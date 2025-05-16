import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CertificateEntity } from './entity/certificate.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CertificateService {
  constructor(
    @InjectRepository(CertificateEntity)
    private readonly certificateRepository: Repository<CertificateEntity>,
  ) {}

  async insertCertificate(
    certificate: Express.Multer.File,
    password: string,
    expiredAt: string,
  ): Promise<CertificateEntity> {
    try {
      const data = {
        certificate: certificate.buffer,
        password,
        expiredAt,
      };

      const newCertificate = this.certificateRepository.create(data);

      return await this.certificateRepository.save(newCertificate);
    } catch (error) {
      throw new BadRequestException('Error inserting certificate: ' + error);
    }
  }

  async getCertificateById(id: string) {
    if (!id) {
      throw new Error('Certificate ID is required');
    }
    const certificate = await this.certificateRepository.findOne({
      where: { id },
    });

    if (!certificate) {
      throw new Error('Certificate not found');
    }

    return certificate;
  }

  async deleteCertificate(id: string) {
    if (!id) {
      throw new Error('Certificate ID is required');
    }

    const certificate = await this.certificateRepository.findOne({
      where: { id },
    });

    if (!certificate) {
      throw new Error('Certificate not found');
    }

    await this.certificateRepository.delete(id);
  }

  async getAllCertificates() {
    try {
      const certificates = await this.certificateRepository.find();
      // Retorna apenas os dados necessários, sem o buffer do certificado
      return certificates.map((cert) => ({
        id: cert.id,
        name: cert.password,
      }));
    } catch (error) {
      console.error('Erro ao buscar certificados:', error);
      throw new Error('Não foi possível buscar os certificados');
    }
  }
}

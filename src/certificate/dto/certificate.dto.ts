import { IsNotEmpty, IsString } from 'class-validator';

export class CertificateDTO {
  @IsNotEmpty()
  @IsString()
  doctorId: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  expiresAt: string;
}

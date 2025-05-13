import { IsString, IsNotEmpty } from 'class-validator';

export class FileDto {
  @IsString()
  @IsNotEmpty()
  clientId: string;

  @IsString()
  @IsNotEmpty()
  serviceId: string;

  @IsString()
  @IsNotEmpty()
  doctorId: string;
}

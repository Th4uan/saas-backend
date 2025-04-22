import { IsString, IsNotEmpty } from 'class-validator';

export class FileDto {
  @IsString()
  @IsNotEmpty()
  clientId: string;

  @IsString()
  @IsNotEmpty()
  serviceId: string;
}

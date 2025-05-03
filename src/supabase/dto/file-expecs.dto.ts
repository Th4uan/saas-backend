import { IsNotEmpty, IsString } from 'class-validator';

export class FileExpecsDto {
  @IsString()
  @IsNotEmpty()
  clientId: string;

  @IsString()
  @IsNotEmpty()
  serviceId: string;

  @IsString()
  @IsNotEmpty()
  certificateId: string;
}

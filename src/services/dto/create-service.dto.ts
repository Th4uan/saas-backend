import { IsDate, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ServiceStatusEnum } from '../enum/service-status.enum';

export class CreateServiceDto {
  @IsNotEmpty()
  @IsString()
  clientId: string;

  @IsNotEmpty()
  @IsString()
  doctorId: string;

  @IsNotEmpty()
  @IsDate()
  date: Date;

  @IsNotEmpty()
  @IsString()
  time: string;

  @IsNotEmpty()
  @IsEnum(ServiceStatusEnum)
  status: ServiceStatusEnum;

  @IsNotEmpty()
  @IsString()
  typeService: string;
}

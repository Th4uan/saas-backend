import { IsEnum, IsOptional } from 'class-validator';
import { ServiceStatusEnum } from '../enum/service-status.enum';

export class UpdateServiceDto {
  @IsEnum(ServiceStatusEnum)
  @IsOptional()
  status?: ServiceStatusEnum;

  @IsOptional()
  date?: Date;
}

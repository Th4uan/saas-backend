import { IsEnum, IsNotEmpty } from 'class-validator';
import { ServiceStatusEnum } from '../enum/service-status.enum';

export class UpdateServiceDto {
  @IsNotEmpty()
  @IsEnum(ServiceStatusEnum)
  status: ServiceStatusEnum;
}

import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsString,
} from 'class-validator';
import { ServiceStatusEnum } from '../enum/service-status.enum';
import { PaymentDto } from 'src/payment/dto/payment.dto';

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
  @IsEnum(ServiceStatusEnum)
  status: ServiceStatusEnum;

  @IsNotEmpty()
  @IsObject()
  payment: PaymentDto;

  @IsNotEmpty()
  @IsString()
  typeService: string;
}

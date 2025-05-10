import { IsEnum, IsNotEmpty, IsObject, IsString } from 'class-validator';
import { ServiceStatusEnum } from '../enum/service-status.enum';
import { PaymentDto } from 'src/payment/dto/payment.dto';
import { TypeService } from '../enum/type-service..enum';
import { RecurrenceEnum } from '../enum/recurrence.enum';

export class CreateServiceDto {
  @IsNotEmpty()
  @IsString()
  clientId: string;

  @IsNotEmpty()
  @IsString()
  doctorId: string;

  @IsNotEmpty()
  date: Date;

  @IsNotEmpty()
  @IsEnum(ServiceStatusEnum)
  status: ServiceStatusEnum;

  @IsNotEmpty()
  @IsObject()
  payment: PaymentDto;

  @IsNotEmpty()
  @IsEnum(TypeService)
  typeService: TypeService;

  @IsNotEmpty()
  @IsEnum(RecurrenceEnum)
  recurrence: RecurrenceEnum;

  @IsNotEmpty()
  @IsString()
  agreementId: string;
}

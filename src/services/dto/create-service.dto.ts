import { ServiceStatusEnum } from '../enum/service-status.enum';

export class CreateServiceDto {
  clientId: string;
  doctorId: string;
  date: Date;
  time: string;
  status: ServiceStatusEnum; // ServiceStatusEnum
  typeService: string;
}

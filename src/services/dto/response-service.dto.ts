import { ServiceStatusEnum } from '../enum/service-status.enum';

export class ResponseServiceDto {
  id: string;
  client: Client;
  doctor: Doctor;
  payment: Payment;
  date: Date;
  status: ServiceStatusEnum;
  typeService: string;
}

class Doctor {
  id: string;
  fullName: string;
  email: string;
}

class Client {
  id: string;
  fullName: string;
  phone: string;
  phoneIsWhatsApp: boolean;
}

class Payment {
  id: string;
  formaPagamento: string;
  valor: number;
  status: string;
}

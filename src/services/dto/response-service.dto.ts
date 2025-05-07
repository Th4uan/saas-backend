import { PaymentMethodEnum } from 'src/payment/enums/payment-method.enum';
import { ServiceStatusEnum } from '../enum/service-status.enum';
import { PaymentStatusEnum } from 'src/payment/enums/payment-status.enum';

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
  paymentMethod: PaymentMethodEnum;
  price: number;
  status: PaymentStatusEnum;
}

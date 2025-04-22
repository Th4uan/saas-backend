export class ResponseServiceDto {
  id: string;
  client: Client;
  doctor: Doctor;
  date: Date;
  time: string;
  status: string; // ServiceStatusEnum
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

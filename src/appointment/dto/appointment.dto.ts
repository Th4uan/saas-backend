export class AppointmentDto {
  id: string;
  date: Date;
  nomes: string[];
  agreement: AgreementDto;
}

class AgreementDto {
  id: string;
  name: string;
}

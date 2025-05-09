import { CivilStatusEnum } from '../enum/civil-status.enum';

export class ClientResponseDto {
  id: string;
  fullName: string;
  cpf: string;
  phone: string;
  phoneIsWhatsApp: boolean;
  profission: string;
  civilStatus: CivilStatusEnum;
  address: string;
  rg: string;
  birthDate: Date;
  scholarity: string;
  nationality: string;
}

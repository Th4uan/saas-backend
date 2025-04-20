import { CivilStatusEnum } from '../enum/civil-status.enum';

export class AddressResponseDto {
  id: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

export class ClientResponseDto {
  id: string;
  fullName: string;
  cpf: string;
  phone: string;
  phoneIsWhatsApp: boolean;
  profission: string;
  civilStatus: CivilStatusEnum;
  address: AddressResponseDto;
}

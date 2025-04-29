import { ClientResponseDto } from '../dto/client-response.dto';
import { Client } from '../entities/client.entity';

export function mapperClientToDto(client: Client): ClientResponseDto {
  return {
    id: client.id,
    fullName: client.fullName,
    cpf: client.cpf,
    phone: client.phone,
    phoneIsWhatsApp: client.phoneIsWhatsApp,
    profission: client.profission,
    civilStatus: client.civilStatus,
    rg: client.rg,
    birthDate: client.birthDate,
    escolarity: client.escolarity,
    nacionality: client.nacionality,
    address: {
      id: client.address.id,
      street: client.address.street,
      number: client.address.number ?? '',
      complement: client.address.complement,
      neighborhood: client.address.neighborhood,
      city: client.address.city,
      state: client.address.state,
      zipCode: client.address.zipCode,
    },
  };
}

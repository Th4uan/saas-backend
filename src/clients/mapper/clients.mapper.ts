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
    scholarity: client.scholarity,
    nationality: client.nationality,
    address: client.address,
  };
}

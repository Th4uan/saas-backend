import { ResponseServiceDto } from '../dto/response-service.dto';
import { Service } from '../entities/service.entity';

export function mapServiceToDto(service: Service): ResponseServiceDto {
  return {
    id: service.id,
    client: {
      id: service.client.id,
      fullName: service.client.fullName,
      phone: service.client.phone,
      phoneIsWhatsApp: service.client.phoneIsWhatsApp,
    },
    doctor: {
      id: service.doctor.id,
      fullName: service.doctor.fullName,
      email: service.doctor.email,
    },
    payment: {
      id: service.payments.id,
      formaPagamento: service.payments.formaPagamento,
      valor: service.payments.valor,
      status: service.payments.status,
    },
    date: service.date,
    status: service.status,
    typeService: service.typeService,
  };
}

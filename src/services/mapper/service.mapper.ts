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
      username: service.doctor.username,
    },
    payment: {
      id: service.payments.id,
      price: +service.payments.price,
      status: service.payments.status,
      paymentMethod: service.payments.paymentMethod,
    },
    date: service.date,
    status: service.status,
    typeService: service.typeService,
    recurrence: service.recurrence,
    agreement: service.agreement.name,
  };
}

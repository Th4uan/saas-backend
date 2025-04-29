import { AppointmentDto } from '../dto/appointment.dto';
import { Appointment } from '../entity/appointment.entity';

export function mapAppoitmentToDto(appointment: Appointment): AppointmentDto {
  return {
    id: appointment.id,
    date: appointment.date,
    nomes: appointment.nomes,
    agreement: {
      id: appointment.agreement.id,
      name: appointment.agreement.name,
    },
  };
}

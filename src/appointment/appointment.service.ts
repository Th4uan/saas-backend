import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Appointment } from './entity/appointment.entity';
import { Repository } from 'typeorm';
import { AgreementService } from 'src/agreement/agreement.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { mapAppoitmentToDto } from './mapper/apppoiment.mapper';
import { AppointmentDto } from './dto/appointment.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    private readonly agreementService: AgreementService,
  ) {}

  async createAppointment(
    appointmentDto: CreateAppointmentDto,
  ): Promise<AppointmentDto> {
    if (!appointmentDto) {
      throw new BadRequestException('Invalid appointment data');
    }
    const data = {
      date: appointmentDto.date,
      nomes: appointmentDto.nomes,
      agreement: await this.agreementService.createAgreement(
        appointmentDto.agreement,
      ),
    };

    const appointment = this.appointmentRepository.create(data);

    if (!appointment) {
      throw new BadRequestException('Error creating appointment');
    }

    await this.appointmentRepository.save(appointment);

    const returnedAppoitment = mapAppoitmentToDto(appointment);

    return returnedAppoitment;
  }

  async getAllAppointments(
    paginationDto: PaginationDto,
  ): Promise<AppointmentDto[]> {
    const { limit = 10, offset = 0 } = paginationDto;
    const skip = (offset - 1) * limit;

    if (limit <= 0 || offset <= 0) {
      throw new BadRequestException('Invalid pagination parameters');
    }
    if (limit > 50) {
      throw new BadRequestException('Limit cannot exceed 50');
    }
    const appointments = await this.appointmentRepository.find({
      skip: skip,
      take: limit,
      relations: ['agreement'],
    });

    if (appointments.length === 0) {
      throw new BadRequestException('No appointments found');
    }
    const data: AppointmentDto[] = appointments.map((appointment) =>
      mapAppoitmentToDto(appointment),
    );

    return data;
  }

  async findOneAppointment(id: string): Promise<AppointmentDto> {
    if (id == '' || id == null) {
      throw new BadRequestException('Invalid appointment ID');
    }

    const appointment = await this.appointmentRepository.findOne({
      where: { id },
      relations: ['agreement'],
    });

    if (!appointment) {
      throw new BadRequestException('Appointment not found');
    }

    const data = mapAppoitmentToDto(appointment);

    return data;
  }

  async deleteAppointment(id: string): Promise<void> {
    if (id == '' || id == null) {
      throw new BadRequestException('Invalid appointment ID');
    }

    const appointment = await this.appointmentRepository.findOne({
      where: { id },
    });

    if (!appointment) {
      throw new BadRequestException('Appointment not found');
    }

    await this.appointmentRepository.delete(id);
  }
}

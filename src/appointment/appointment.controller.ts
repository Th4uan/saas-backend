import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { AuthTokenGuard } from 'src/auth/guards/auth-token.guard';

@UseGuards(AuthTokenGuard)
@Controller('appointment')
@ApiTags('appointment')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post()
  async createAppointment(createAppointmentDto: CreateAppointmentDto) {
    if (!createAppointmentDto) {
      throw new BadRequestException('Invalid appointment data');
    }

    const date = new Date(createAppointmentDto.date);

    createAppointmentDto.date = date;
    const appointment =
      await this.appointmentService.createAppointment(createAppointmentDto);
    if (!appointment) {
      throw new BadRequestException('Error creating appointment');
    }
    return {
      message: 'Appointment created successfully',
      appointment: appointment,
    };
  }

  @Get()
  async getAllAppointments(@Query() paginationDto: PaginationDto) {
    const appointments =
      await this.appointmentService.getAllAppointments(paginationDto);
    return {
      message: 'Appointments found successfully',
      appointments: appointments,
      total: appointments.length,
      limit: paginationDto.limit,
      offset: paginationDto.offset,
    };
  }

  @Get(':id')
  async getAppointmentById(@Param('id') id: string) {
    const appointment = await this.appointmentService.findOneAppointment(id);
    if (!appointment) {
      throw new BadRequestException('No appointment found');
    }
    return {
      message: 'Appointment found successfully',
      appointment: appointment,
    };
  }

  @Delete(':id')
  async deleteAppointment(@Param('id') id: string) {
    await this.appointmentService.deleteAppointment(id);

    return {
      message: 'Appointment deleted successfully',
      id: id,
    };
  }
}

import { Module } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { AppointmentController } from './appointment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './entity/appointment.entity';
import { AgreementModule } from 'src/agreement/agreement.module';

@Module({
  imports: [TypeOrmModule.forFeature([Appointment]), AgreementModule],
  controllers: [AppointmentController],
  providers: [AppointmentService],
  exports: [AppointmentService],
})
export class AppointmentModule {}

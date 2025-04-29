import { IsArray, IsDate, IsNotEmpty, IsString } from 'class-validator';

export class CreateAppointmentDto {
  @IsDate()
  @IsNotEmpty()
  date: Date;
  @IsNotEmpty()
  @IsArray()
  nomes: string[];
  @IsNotEmpty()
  @IsString()
  agreement: string;
}

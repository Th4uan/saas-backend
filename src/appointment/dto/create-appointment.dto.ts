import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateAppointmentDto {
  @IsNotEmpty()
  date: Date;
  @IsNotEmpty()
  @IsArray()
  nomes: string[];
  @IsNotEmpty()
  @IsString()
  agreement: string;
}

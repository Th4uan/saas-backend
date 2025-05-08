import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAppointmentDto {
  @IsNotEmpty()
  @Type(() => Date)  //Esse dev back ta fraco
  date: Date;
  @IsNotEmpty()
  @IsArray()
  nomes: string[];
  @IsNotEmpty()
  @IsString()
  agreement: string;
}

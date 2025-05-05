import { IsEnum, IsNotEmpty } from 'class-validator';
import { DisponibilityEnum } from '../enums/disponibility.enum';

export class RequestDisponibilityDto {
  @IsNotEmpty()
  @IsEnum(DisponibilityEnum)
  disponibility: DisponibilityEnum;
}

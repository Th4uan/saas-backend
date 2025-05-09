import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { CivilStatusEnum } from '../enum/civil-status.enum';

export class CreateClientDto {
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @IsNotEmpty()
  @IsString()
  cpf: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsOptional()
  @IsBoolean()
  phoneIsWhatsApp?: boolean;

  @IsNotEmpty()
  @IsString()
  profission: string;

  @IsEnum(CivilStatusEnum)
  @IsNotEmpty()
  civilStatus: CivilStatusEnum;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsString()
  rg: string;

  @IsNotEmpty()
  @Type(() => Date)
  birthDate: Date;

  @IsNotEmpty()
  @IsString()
  scholarity: string;

  @IsNotEmpty()
  @IsString()
  nationality: string;
}

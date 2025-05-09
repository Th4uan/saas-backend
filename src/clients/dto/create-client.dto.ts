import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateAddressDto } from 'src/address/dto/create-address.dto';
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

  @ValidateNested()
  @Type(() => CreateAddressDto) //string pae
  address: CreateAddressDto;

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

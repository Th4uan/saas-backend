import { Type } from 'class-transformer';
import {
  IsBoolean,
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
  @Type(() => CreateAddressDto)
  adress: CreateAddressDto;
}

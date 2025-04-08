import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'John Doe Silva',
    required: true,
    description: 'Full name of the user',
    minLength: 3,
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(255)
  fullName: string;

  @ApiProperty({
    example: 'john_doe',
    required: true,
    description: 'Username of the user',
    minLength: 3,
  })
  @IsNotEmpty()
  @MinLength(3)
  username: string;

  @ApiProperty({
    example: 'vitormeufan@gmail.com',
    required: true,
    description: 'Email of the user',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: '12345678',
    required: true,
    description: 'Password of the user',
    minLength: 8,
  })
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}

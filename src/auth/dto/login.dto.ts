import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'vitormeufan@gmail.com',
    required: true,
    description: 'Email of the user',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '12345678',
    required: true,
    description: 'Password of the user',
    minLength: 8,
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}

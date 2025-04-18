import { IsNotEmpty, IsString } from 'class-validator';

export class PasswordDto {
  @IsString()
  @IsNotEmpty()
  password: string;
}

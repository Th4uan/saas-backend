import { Body, Controller, Post } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  @Post()
  async signUp(@Body() loginDto: LoginDto) {
    return Promise.resolve(console.log('signIn'));
  }
}

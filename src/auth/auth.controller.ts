import { Body, Controller, Inject, Post, Res } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { Response } from 'express';
import cookieConfig from './configs/cookie.config';
import { ConfigType } from '@nestjs/config';

@Controller('api/v1/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @Inject(cookieConfig.KEY)
    private readonly cookie: ConfigType<typeof cookieConfig>,
  ) {}

  @Post()
  async signUp(@Body() loginDto: LoginDto, @Res() res: Response) {
    const payload = await this.authService.signUp(loginDto);
    res.cookie('jwt', payload, {
      httpOnly: this.cookie.httpOnly,
      secure: this.cookie.secure,
      sameSite: this.cookie.sameSite as 'strict' | 'lax' | 'none' | undefined,
      maxAge: this.cookie.maxAge,
    });

    return {
      message: 'Login successful',
      user: {
        email: loginDto.email,
      },
    };
  }
}

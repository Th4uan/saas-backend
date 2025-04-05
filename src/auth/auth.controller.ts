import {
  Body,
  Controller,
  HttpCode,
  Inject,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { Response } from 'express';
import cookieConfig from './configs/cookie.config';
import { ConfigType } from '@nestjs/config';
import { IsPublic } from 'src/common/decorators/is-public.decorator';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RefreshTokenParam } from './params/refresh-token.param';
import { AuthTokenGuard } from './guards/auth-token.guard';
import { TokenPayloadParam } from './params/token-payload.param';
import { JwtPayload } from './interfaces/jwt-interface.interface';

@UseGuards(AuthTokenGuard)
@Controller('api/v1/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @Inject(cookieConfig.KEY)
    private readonly cookie: ConfigType<typeof cookieConfig>,
  ) {}

  @HttpCode(200)
  @IsPublic()
  @Post()
  async signUp(@Body() loginDto: LoginDto, @Res() res: Response) {
    const { tokens, user } = await this.authService.signUp(loginDto);
    res.cookie('jwt', tokens[0], {
      httpOnly: this.cookie.httpOnly,
      secure: this.cookie.secure,
      sameSite: this.cookie.sameSite as 'strict' | 'lax' | 'none' | undefined,
      maxAge: this.cookie.maxAge,
    });
    res.cookie('refresh_token', tokens[1], {
      httpOnly: this.cookie.httpOnly,
      secure: this.cookie.secure,
      sameSite: this.cookie.sameSite as 'strict' | 'lax' | 'none' | undefined,
      maxAge: this.cookie.maxAgeRefresh,
    });
    return {
      message: 'Login successful',
      user: {
        id: user.id,
        email: loginDto.email,
      },
    };
  }

  @IsPublic()
  @HttpCode(201)
  @Post('refresh')
  async reAuthenticate(
    @RefreshTokenParam() refreshTokenDto: RefreshTokenDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = await this.authService.refreshToken(refreshTokenDto);
    res.cookie('jwt', token, {
      httpOnly: this.cookie.httpOnly,
      secure: this.cookie.secure,
      sameSite: this.cookie.sameSite as 'strict' | 'lax' | 'none' | undefined,
      maxAge: this.cookie.maxAge,
    });

    return {
      message: 'Reauthenticate sucessful',
    };
  }

  @HttpCode(200)
  @Post('logout')
  async logout(
    @Res({ passthrough: true }) res: Response,
    @TokenPayloadParam() jwtPayload: JwtPayload,
  ) {
    await this.authService.logout(jwtPayload.sub);
    res.clearCookie('jwt', {
      httpOnly: this.cookie.httpOnly,
      secure: this.cookie.secure,
      sameSite: this.cookie.sameSite as 'strict' | 'lax' | 'none' | undefined,
    });
    res.clearCookie('refresh_token', {
      httpOnly: this.cookie.httpOnly,
      secure: this.cookie.secure,
      sameSite: this.cookie.sameSite as 'strict' | 'lax' | 'none' | undefined,
    });
    return {
      message: 'Logout successful',
    };
  }
}

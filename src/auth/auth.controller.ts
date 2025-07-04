import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { Response } from 'express';
import cookieConfig from './configs/cookie.config';
import { ConfigType } from '@nestjs/config';
import { IsPublic } from 'src/common/decorators/is-public.decorator';
import { RefreshTokenParam } from './params/refresh-token.param';
import { AuthTokenGuard } from './guards/auth-token.guard';
import {
  ApiBody,
  ApiCookieAuth,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Auth')
@UseGuards(AuthTokenGuard)
@Controller('/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @Inject(cookieConfig.KEY)
    private readonly cookie: ConfigType<typeof cookieConfig>,
  ) {}

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User auth login',
    example: {
      message: 'Login successful',
      user: {
        id: 'exemplodeIDGrande',
        email: 'teste@gmail.com',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'User or password invalid',
    example: {
      statusCode: HttpStatus.UNAUTHORIZED,
      message: 'User or password invalid',
      error: 'Unauthorized',
    },
  })
  @ApiBody({
    description: 'User Credentials',
    required: true,
    type: LoginDto,
    examples: {
      example: {
        value: {
          email: 'joaoTeste@gmail.com',
          password: 'suasenha123',
        },
      },
    },
  })
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
      domain: this.cookie.domain,
    });
    res.cookie('refresh_token', tokens[1], {
      httpOnly: this.cookie.httpOnly,
      secure: this.cookie.secure,
      sameSite: this.cookie.sameSite as 'strict' | 'lax' | 'none' | undefined,
      maxAge: this.cookie.maxAgeRefresh,
      domain: this.cookie.domain,
    });
    return res.json({
      message: 'Login successful',
      user,
    });
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Reauthenticate user',
    example: {
      message: 'Reauthenticate sucessful',
    },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid or Expired Refresh Token',
    example: {
      statusCode: HttpStatus.UNAUTHORIZED,
      message: 'Invalid or Expired Refresh Token',
      error: 'Unauthorized',
    },
  })
  @ApiCookieAuth('refresh_token')
  @IsPublic()
  @HttpCode(201)
  @Post('refresh')
  async reAuthenticate(
    @RefreshTokenParam() refreshToken: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (!refreshToken) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Invalid or Expired Refresh Token',
        error: 'Unauthorized',
      });
    }
    const [token, newRefresh] = await this.authService.refreshToken({
      refreshToken,
    });
    res.clearCookie('refresh_token', {
      httpOnly: this.cookie.httpOnly,
      secure: this.cookie.secure,
      sameSite: this.cookie.sameSite as 'strict' | 'lax' | 'none' | undefined,
      domain: this.cookie.domain,
    });
    res.cookie('refresh_token', newRefresh, {
      httpOnly: this.cookie.httpOnly,
      secure: this.cookie.secure,
      sameSite: this.cookie.sameSite as 'strict' | 'lax' | 'none' | undefined,
      maxAge: this.cookie.maxAgeRefresh,
      domain: this.cookie.domain,
    });
    res.cookie('jwt', token, {
      httpOnly: this.cookie.httpOnly,
      secure: this.cookie.secure,
      sameSite: this.cookie.sameSite as 'strict' | 'lax' | 'none' | undefined,
      maxAge: this.cookie.maxAge,
      domain: this.cookie.domain,
    });

    return {
      message: 'Reauthenticate sucessful',
    };
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Logout successful',
    example: {
      message: 'Logout successful',
    },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid or Expired Refresh Token',
    example: {
      statusCode: HttpStatus.UNAUTHORIZED,
      message: 'Invalid or Expired Refresh Token',
      error: 'Unauthorized',
    },
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden',
    example: {
      statusCode: HttpStatus.FORBIDDEN,
      message: 'Forbidden',
      error: 'Forbidden',
    },
  })
  @ApiQuery({
    name: 'id',
    required: true,
    description: 'ID of the user',
    type: String,
    example: 'exemplodeIDGrande',
  })
  @HttpCode(200)
  @IsPublic()
  @Post('logout')
  async logout(
    @Res({ passthrough: true }) res: Response,
    @Query('id') id: string,
  ) {
    await this.authService.logout(id);
    res.clearCookie('jwt', {
      httpOnly: this.cookie.httpOnly,
      secure: this.cookie.secure,
      sameSite: this.cookie.sameSite as 'strict' | 'lax' | 'none' | undefined,
      domain: this.cookie.domain,
    });
    res.clearCookie('refresh_token', {
      httpOnly: this.cookie.httpOnly,
      secure: this.cookie.secure,
      sameSite: this.cookie.sameSite as 'strict' | 'lax' | 'none' | undefined,
      domain: this.cookie.domain,
    });
    return {
      message: 'Logout successful',
    };
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Check token successful',
    example: {
      message: 'valid token',
    },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid or Expired Refresh Token',
    example: {
      statusCode: HttpStatus.UNAUTHORIZED,
      message: 'Invalid or Expired Refresh Token',
      error: 'Unauthorized',
    },
  })
  @ApiQuery({
    name: 'id',
    required: true,
    description: 'ID of the user',
    type: String,
    example: 'exemplodeIDGrande',
  })
  @IsPublic()
  @HttpCode(200)
  @Post('check')
  async checkToken(@Query('id') id: string) {
    const token = await this.authService.checkToken(id);
    return {
      message: token,
    };
  }
}

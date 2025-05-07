import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import jwtConfig from '../configs/jwt.config';
import { ConfigType } from '@nestjs/config';
import { REQUEST_TOKEN_JWT_PAYLOAD } from '../auth.constants';
import { JwtPayload } from '../interfaces/jwt-interface.interface';
import { RequestWithCookies } from '../interfaces/request-with-cookies.interface';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthTokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly config: ConfigType<typeof jwtConfig>,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request: Request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromCookies(request);

    console.log('JWT cookie recebido:', token);

    if (!token) {
      throw new UnauthorizedException('Invalid token');
    }

    try {
      const payload: JwtPayload = await this.jwtService.verifyAsync(
        token,
        this.config,
      );
      request[REQUEST_TOKEN_JWT_PAYLOAD] = payload;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }

    return true;
  }

  extractTokenFromCookies(request: RequestWithCookies): string | undefined {
    const token = request.cookies?.jwt || request.cookies?.['jwt'];
    return token || undefined;
  }
}

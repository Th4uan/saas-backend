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

@Injectable()
export class AuthTokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly config: ConfigType<typeof jwtConfig>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('');
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

  extractTokenFromHeader(request: Request): string | undefined {
    const authorization = request.headers?.authorization;

    if (!authorization || typeof authorization !== 'string') {
      return;
    }

    return authorization.split(' ')[1];
  }
}

import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { UserRoleEnum } from 'src/user/enums/user-role.enum';
import { Request } from 'express';
import { REQUEST_TOKEN_JWT_PAYLOAD } from '../auth.constants';
import { JwtPayload } from '../interfaces/jwt-interface.interface';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    ctx: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // Obter roles definidos para a rota
    const rolesByRoute =
      this.reflector.get<UserRoleEnum[]>(ROLES_KEY, ctx.getHandler()) || [];

    // Se não há roles definidos, permitir acesso
    if (!rolesByRoute.length) {
      return true;
    }

    const request: Request = ctx.switchToHttp().getRequest();
    const payload: JwtPayload = request[
      REQUEST_TOKEN_JWT_PAYLOAD
    ] as JwtPayload;

    if (!payload) {
      throw new UnauthorizedException('not possible indentifier user');
    }

    const userRole = payload.role as UserRoleEnum;

    console.log('User role:', userRole);
    console.log('Allowed roles:', rolesByRoute);

    const hasTheRole = rolesByRoute.includes(userRole);

    if (!hasTheRole) {
      throw new ForbiddenException(
        'this user is not allowed call in this route',
      );
    }

    return true;
  }
}

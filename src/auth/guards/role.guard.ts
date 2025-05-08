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
    const rolesByRoute = (this.reflector.get<string[]>(
      ROLES_KEY,
      ctx.getHandler(),
    ) || []) as UserRoleEnum[];
    if (!rolesByRoute.length) {
      return true;
    }
    const allowedRoles = Array.from(new Set(...rolesByRoute).values());

    const request: Request = ctx.switchToHttp().getRequest();

    const payload: JwtPayload = request[
      REQUEST_TOKEN_JWT_PAYLOAD
    ] as JwtPayload;

    if (!payload) {
      throw new UnauthorizedException('not possible indentifier user');
    }

    const role = payload.role;

    const hasTheRole = allowedRoles.includes(role);

    if (!hasTheRole) {
      throw new ForbiddenException(
        'this user is not allowed call in this route',
      );
    }
    return true;
  }
}

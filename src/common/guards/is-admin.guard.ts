import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { REQUEST_TOKEN_JWT_PAYLOAD } from 'src/auth/auth.constants';
import { JwtPayload } from 'src/auth/interfaces/jwt-interface.interface';

@Injectable()
export class isAdminGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const payload = request[REQUEST_TOKEN_JWT_PAYLOAD] as JwtPayload;
    return payload.role === 'admin';
  }
}

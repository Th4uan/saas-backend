import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { REQUEST_TOKEN_JWT_PAYLOAD } from '../auth.constants';
import { JwtPayload } from 'jsonwebtoken';

export const TokenPayloadParam = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const context = ctx.switchToHttp();
    const request: Request = context.getRequest();
    const tokenPayload = request[REQUEST_TOKEN_JWT_PAYLOAD] as JwtPayload;
    return tokenPayload;
  },
);

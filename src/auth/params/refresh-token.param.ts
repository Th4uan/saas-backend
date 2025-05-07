import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestWithCookies } from '../interfaces/request-with-cookies.interface';

export const RefreshTokenParam = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const context = ctx.switchToHttp();
    const request: RequestWithCookies = context.getRequest();
    const refreshToken = request.cookies?.['refresh_token'];
    console.log('Refresh token recebido:', refreshToken); // Adicione este log
    return refreshToken;
  },
);

import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(Error)
export class ErrorExceptionFilter implements ExceptionFilter {
  catch(
    exception: Error & { status?: () => number; getResponse?: () => any },
    host: ArgumentsHost,
  ) {
    const ctx = host.switchToHttp();
    const response: Response = ctx.getResponse();
    const request: Request = ctx.getRequest();

    const status = exception.status ? exception.status() : 400;

    const exceptionResponse: { message: string; status: number } =
      exception.getResponse
        ? (exception.getResponse() as { message: string; status: number })
        : { message: 'Error', status };

    response.status(status).json({
      ...exceptionResponse,
      data: new Date().toISOString(),
      path: request.url,
    });
  }
}

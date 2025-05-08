import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(Error)
export class ErrorExceptionFilter implements ExceptionFilter {
  catch(
    exception:
      | Error
      | HttpException
      | (Error & {
          status?: number | (() => number);
          getResponse?: () => any;
        }),
    host: ArgumentsHost,
  ) {
    const ctx = host.switchToHttp();
    const response: Response = ctx.getResponse();
    const request: Request = ctx.getRequest();

    let status: number;
    if (exception instanceof HttpException) {
      status = exception.getStatus();
    } else if (
      'status' in exception &&
      typeof exception.status === 'function'
    ) {
      status = exception.status();
    } else if ('status' in exception && typeof exception.status === 'number') {
      status = exception.status;
    } else {
      status =
        exception.message.includes('required') ||
        exception.message.includes('invalid') ||
        exception.message.includes('not found')
          ? HttpStatus.BAD_REQUEST
          : HttpStatus.INTERNAL_SERVER_ERROR;
    }

    let message: string | Record<string, unknown>;
    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();
      message =
        typeof exceptionResponse === 'object'
          ? (exceptionResponse as Record<string, unknown>)
          : { message: exception.message };
    } else if (
      'getResponse' in exception &&
      typeof exception.getResponse === 'function'
    ) {
      message = exception.getResponse() as Record<string, unknown>;
    } else {
      message = { message: exception.message };
    }

    const responseBody: {
      statusCode: number;
      message: string | Record<string, unknown>;
      timestamp: string;
      path: string;
    } = {
      statusCode: status,
      message: message,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    console.log(
      `[ErrorExceptionFilter] ${status} ${request.method} ${request.url} - ${exception.message}`,
    );

    response.status(status).json(responseBody);
  }
}

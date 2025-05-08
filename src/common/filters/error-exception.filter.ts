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

    // Determinar o status HTTP adequado
    let status: number;
    if (exception instanceof HttpException) {
      // Se for uma exceção HTTP do NestJS, use seu status
      status = exception.getStatus();
    } else if (
      'status' in exception &&
      typeof exception.status === 'function'
    ) {
      // Se tiver um método status(), chame-o
      status = exception.status();
    } else if ('status' in exception && typeof exception.status === 'number') {
      // Se tiver uma propriedade status numérica
      status = exception.status;
    } else {
      // Caso contrário, use 400 para erros de validação ou 500 para outros
      status =
        exception.message.includes('required') ||
        exception.message.includes('invalid') ||
        exception.message.includes('not found')
          ? HttpStatus.BAD_REQUEST
          : HttpStatus.INTERNAL_SERVER_ERROR;
    }

    // Obter a mensagem de erro
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

    // Estruturar a resposta (todos os campos tipados corretamente)
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

    // Log para depuração
    console.log(
      `[ErrorExceptionFilter] ${status} ${request.method} ${request.url} - ${exception.message}`,
    );

    // Enviar resposta
    response.status(status).json(responseBody);
  }
}

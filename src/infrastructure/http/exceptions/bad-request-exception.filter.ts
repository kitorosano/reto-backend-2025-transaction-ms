import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { BadRequestCustomException } from '../../../domain/exceptions/bad-request.exception';
import { Log } from '../../../shared/log';

@Catch(BadRequestCustomException)
export class BadRequestCustomExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestCustomException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    Log.error(
      'BadRequestCustomExceptionFilter',
      `(${request.method}) at {${request.path}} error: `,
      exception.message,
    );

    response.status(HttpStatus.BAD_REQUEST).json({
      status: HttpStatus.BAD_REQUEST,
      message: exception.message,
      errors: exception.errors,
    });
  }
}

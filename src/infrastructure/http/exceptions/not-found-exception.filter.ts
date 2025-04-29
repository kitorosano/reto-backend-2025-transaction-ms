import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { NotFoundCustomException } from '../../../domain/exceptions/not-found.exception';
import { Log } from '../../../shared/log';

@Catch(NotFoundCustomException)
export class NotFoundCustomExceptionFilter implements ExceptionFilter {
  catch(exception: NotFoundCustomException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    Log.error(
      'NotFoundCustomExceptionFilter',
      `(${request.method}) at {${request.path}} error: `,
      exception.message,
    );

    response.status(HttpStatus.NOT_FOUND).json({
      status: HttpStatus.NOT_FOUND,
      message: exception.message,
      resource: exception.resource,
    });
  }
}

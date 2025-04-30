import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Log } from '../../../common/log';
import { ResourceNotFoundException } from '../../../common/exceptions/application.exceptions';

@Catch(ResourceNotFoundException)
export class NotFoundExceptionFilter implements ExceptionFilter {
  catch(exception: ResourceNotFoundException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    Log.error(
      'NotFoundCustomExceptionFilter',
      `(${request.method}) at {${request.path}} error: `,
      exception.message,
    );

    response.status(HttpStatus.NOT_FOUND).json({
      message: exception.message,
      resource: exception.resource,
    });
  }
}

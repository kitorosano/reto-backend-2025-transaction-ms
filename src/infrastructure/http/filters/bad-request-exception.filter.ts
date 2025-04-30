import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { BusinessRuleViolationException } from '../../../common/exceptions/application.exceptions';
import { Log } from '../../../common/log';

@Catch(BusinessRuleViolationException)
export class BadRequestExceptionFilter implements ExceptionFilter {
  catch(exception: BusinessRuleViolationException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    Log.error(
      'BadRequestCustomExceptionFilter',
      `(${request.method}) at {${request.path}} error: `,
      exception.message,
    );

    response.status(HttpStatus.BAD_REQUEST).json({
      message: exception.message,
    });
  }
}

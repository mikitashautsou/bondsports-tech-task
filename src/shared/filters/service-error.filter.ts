import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ServiceError } from '../errors/service.error';

@Catch(ServiceError)
export class ServiceErrorFilter implements ExceptionFilter {
  catch(exception: ServiceError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(HttpStatus.BAD_REQUEST).json({
      status: exception.status,
    });
  }
}

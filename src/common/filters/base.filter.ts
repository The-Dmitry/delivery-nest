import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class BaseFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const errorData = exception.getResponse();
    const code = exception.getStatus();

    const isErrorDataObject =
      typeof errorData === 'object' && errorData !== null;
    const response = ctx.getResponse<Response>();

    const data = isErrorDataObject ? errorData : { message: [errorData] };
    if ('message' in data) {
      data.message = Array.isArray(data.message)
        ? data.message
        : [data.message];
    }

    response.status(code).json({
      status: 'error',
      ...data,
    });
  }
}

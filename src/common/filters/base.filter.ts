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
    const test = {
      status: 'error',
    };
    const result = Object.entries(data).reduce<Record<string, unknown>>(
      (acc, [key, value]) => {
        if (key !== 'statusCode') {
          acc[key] = value;
          return acc;
        }
        return acc;
      },
      test,
    );
    if ('message' in result) {
      result.message = Array.isArray(result.message)
        ? result.message
        : [result.message];
    }

    response.status(code).json({
      status: 'error',
      status_code: code,
      ...result,
    });
  }
}

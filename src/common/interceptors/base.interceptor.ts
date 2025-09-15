import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface ModifiedResponse<T> {
  status: string;
  status_code: number;
  result: T;
}

@Injectable()
export class BaseInterceptor<T = unknown>
  implements NestInterceptor<T, ModifiedResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ModifiedResponse<T>> {
    const statusCode = context
      .switchToHttp()
      .getResponse<Response>().statusCode;

    return next.handle().pipe(
      map((result: T) => {
        return {
          status: 'ok',
          status_code: statusCode,
          result,
        };
      }),
    );
  }
}

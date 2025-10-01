import {
  Injectable,
  type NestInterceptor,
  type ExecutionContext,
  type CallHandler,
} from '@nestjs/common';
import { type Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { type Response } from 'express';
import { setTokenIntoCookies } from '@utils/setTokenIntoCookies';

@Injectable()
export class TokenInterceptor<
  T extends { accessToken: string; refreshToken: string },
> implements NestInterceptor<T, T>
{
  intercept(context: ExecutionContext, next: CallHandler): Observable<T> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse<Response>();

    return next.handle().pipe(
      map((data: T) => {
        if (
          data &&
          typeof data === 'object' &&
          'accessToken' in data &&
          'refreshToken' in data
        ) {
          setTokenIntoCookies(response, data);
        }

        return data;
      }),
    );
  }
}

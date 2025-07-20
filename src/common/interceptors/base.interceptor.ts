import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface ModifiedResponse<T> {
  status: string;
  data: T;
}

@Injectable()
export class BaseInterceptor<T = unknown>
  implements NestInterceptor<T, ModifiedResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ModifiedResponse<T>> {
    return next.handle().pipe(
      map((data: T) => {
        return {
          status: 'success',
          data,
        };
      }),
    );
  }
}

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import type { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  ClassConstructor,
  plainToInstance,
  ClassTransformOptions,
} from 'class-transformer';

type Data =
  | Record<string, unknown>
  | { data: Record<string, unknown>; pagination: Record<string, unknown> };

@Injectable()
export class SerializeInterceptor implements NestInterceptor {
  constructor(
    private dto: ClassConstructor<unknown>,
    private options?: ClassTransformOptions,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      map((data: Data) => {
        if (!data) return data;
        if (data.data && data.pagination) {
          return {
            data: plainToInstance(this.dto, data.data, {
              ...this.options,
            }),
            pagination: data.pagination,
          };
        }

        return plainToInstance(this.dto, data, {
          ...this.options,
        });
      }),
    );
  }
}

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

@Injectable()
export class SerializeInterceptor implements NestInterceptor {
  constructor(
    private dto: ClassConstructor<unknown>,
    private options?: ClassTransformOptions,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      map((data: unknown) =>
        plainToInstance(this.dto, data, {
          ...this.options,
        }),
      ),
    );
  }
}

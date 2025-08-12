import { SerializeInterceptor } from '@interceptors/serialize.interceptor';
import { UseInterceptors } from '@nestjs/common';
import { ClassConstructor } from 'class-transformer';

export function SerializeResponse(dto: ClassConstructor<unknown>) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

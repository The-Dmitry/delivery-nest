import { JwtPayload } from '@jwt/models/models';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const AnonymousTokenPayload = createParamDecorator(
  (data: keyof JwtPayload, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const payload = request.user;
    if (
      payload &&
      'id' in payload &&
      'anonymous' in payload &&
      'tokenType' in payload &&
      'role' in payload
    ) {
      return data ? payload[data] : payload;
    }
    return null;
  },
);

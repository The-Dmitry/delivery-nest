import { JwtPayload } from '@jwt/models/models';
import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { Request } from 'express';

export const TokenPayload = createParamDecorator(
  (data: keyof JwtPayload, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const payload = request.user;
    if (
      payload &&
      'id' in payload &&
      'anonymous' in payload &&
      'tokenType' in payload
    ) {
      return data ? payload[data] : payload;
    }
    throw new BadRequestException('Invalid token or token data not found');
  },
);

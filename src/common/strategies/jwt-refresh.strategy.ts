import { JwtPayload } from '@jwt/models/models';
import { BadRequestException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) =>
          req.cookies &&
          'refreshToken' in req.cookies &&
          typeof req.cookies.refreshToken === 'string'
            ? req.cookies.refreshToken
            : null,
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'secret',
    });
  }

  validate(payload: JwtPayload): JwtPayload {
    if (
      payload.tokenType !== 'refresh' ||
      !payload.id ||
      !('anonymous' in payload)
    ) {
      throw new BadRequestException('Invalid token type');
    }
    return payload;
  }
}

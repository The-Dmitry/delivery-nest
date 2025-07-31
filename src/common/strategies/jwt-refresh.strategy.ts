import { JwtPayload } from '@jwt/models/models';
import { BadRequestException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { EnvService } from '@/env/env.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private readonly envService: EnvService) {
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
      secretOrKey: envService.jwtSecret,
    });
  }

  validate(payload: JwtPayload): JwtPayload {
    console.log('Validating JWT Refresh Token:', payload);

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

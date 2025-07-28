import { EnvService } from '@/env/env.service';
import { JwtPayload } from '@jwt/models/models';
import { BadRequestException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly envService: EnvService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: envService.jwtSecret,
    });
  }

  validate(payload: JwtPayload) {
    if (
      payload.tokenType !== 'access' ||
      !payload.id ||
      !('anonymous' in payload)
    ) {
      throw new BadRequestException('Invalid token type');
    }
    return payload;
  }
}

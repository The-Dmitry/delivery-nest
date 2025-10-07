import { EnvService } from '@/env/env.service';
import { UsersService } from '@/users/users.service';
import { JwtPayload } from '@jwt/models/models';
import { BadRequestException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { isAdmin } from '@utils/isAdmin';
import IsNotBot from '@utils/isNotBot';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly envService: EnvService,
    private readonly userService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: envService.jwtSecret,
    });
  }

  async validate(payload: JwtPayload) {
    if (
      payload.tokenType !== 'access' ||
      !payload.id ||
      !('anonymous' in payload) ||
      !payload.role
    ) {
      throw new BadRequestException('Invalid token type');
    }
    IsNotBot(payload);
    if (isAdmin(payload.role)) {
      const { role } = await this.userService.findById(payload.id);
      return { ...payload, role };
    }
    return payload;
  }
}

import { EnvService } from '@/env/env.service';
import { UsersService } from '@/users/users.service';
import { JwtPayload } from '@jwt/models/models';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { isAdmin } from '@utils/isAdmin';
import IsNotBot from '@utils/isNotBot';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtAdminStrategy extends PassportStrategy(Strategy, 'jwt-admin') {
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
    try {
      if (!isAdmin(payload.role)) {
        throw new UnauthorizedException();
      }
      const { role } = await this.userService.findById(payload.id);
      if (!isAdmin(role)) {
        throw new UnauthorizedException();
      }
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw new UnauthorizedException('Only admin can access this route');
      }
      throw new BadRequestException('Invalid token');
    }
    return payload;
  }
}

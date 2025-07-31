import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import {
  TokenExpiredError,
  NotBeforeError,
  JsonWebTokenError,
} from 'jsonwebtoken';
import { JwtData, JwtPayload } from '@jwt/models/models';
import { EnvService } from '@env/env.service';

@Injectable()
export class JwtService {
  constructor(
    private readonly NestJwtService: NestJwtService,
    private readonly envService: EnvService,
  ) {}

  verifyToken(token: string): JwtPayload {
    try {
      const payload = this.NestJwtService.verify<JwtPayload>(token);
      if ('id' in payload && 'anonymous' in payload) {
        return payload;
      }
      throw new JsonWebTokenError('');
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new BadRequestException('Token expired');
      }

      if (error instanceof NotBeforeError) {
        throw new BadRequestException('Token not active yet');
      }

      if (error instanceof JsonWebTokenError) {
        throw new BadRequestException('Invalid token');
      }

      throw new InternalServerErrorException('Something went wrong');
    }
  }

  generateToken(id?: string, anonymous: boolean = true): JwtData {
    id ??= crypto.randomUUID();
    const now = Math.floor(Date.now() / 1000);
    const accessTokenExpiresIn = anonymous
      ? this.envService.accessTokenExpiration
      : 86400;

    const accessTokenExpiresAt = new Date(
      (now + accessTokenExpiresIn) * 1000,
    ).toISOString();

    const accessToken = this.NestJwtService.sign(
      { id, anonymous, tokenType: 'access' } satisfies JwtPayload,
      { expiresIn: accessTokenExpiresIn },
    );

    const refreshToken = this.NestJwtService.sign(
      { id, anonymous, tokenType: 'refresh' } satisfies JwtPayload,
      { expiresIn: '10d' },
    );

    return { accessToken, refreshToken, anonymous, accessTokenExpiresAt };
  }
}

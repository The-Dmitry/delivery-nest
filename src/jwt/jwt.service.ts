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

@Injectable()
export class JwtService {
  constructor(private readonly NestJwtService: NestJwtService) {}

  verifyToken(token: string): string {
    try {
      const { userId } = this.NestJwtService.verify<{ userId: string }>(token);
      return userId;
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

  generateToken(userId: string) {
    const accessToken = this.NestJwtService.sign(
      { userId },
      { expiresIn: 300 },
    );
    const refreshToken = this.NestJwtService.sign(
      { userId },
      { expiresIn: '10d' },
    );
    return { accessToken, refreshToken };
  }
}

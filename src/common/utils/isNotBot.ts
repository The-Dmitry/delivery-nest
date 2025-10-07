import { JwtPayload } from '@jwt/models/models';
import { UnauthorizedException } from '@nestjs/common';
import { Role } from 'generated/prisma';

export default function IsNotBot({ role }: JwtPayload) {
  if (role === Role.BOT) {
    throw new UnauthorizedException(
      'Bots are not allowed to access this route',
    );
  }
}

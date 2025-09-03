import { JwtAccessGuard } from '@/common/guards/jwt-access.guard';
import { JwtAdminGuard } from '@/common/guards/jwt-admin.guard';
import { applyDecorators, UseGuards } from '@nestjs/common';
import { Role } from 'generated/prisma';

export function JwtAuthorization(role: Role = 'USER') {
  const guards = {
    ADMIN: JwtAdminGuard,
    USER: JwtAccessGuard,
  };
  return applyDecorators(UseGuards(guards[role]));
}

import { JwtAccessGuard } from '@/common/guards/jwt-access.guard';
import { applyDecorators, UseGuards } from '@nestjs/common';

export function JwtAuthorization() {
  return applyDecorators(UseGuards(JwtAccessGuard));
}

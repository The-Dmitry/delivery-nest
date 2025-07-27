import { Module } from '@nestjs/common';
import { JwtService } from '@jwt/jwt.service';
import { AuthController } from '@auth/auth.controller';
import { AuthService } from '@auth/auth.service';
import { JwtAccessStrategy } from '@/common/strategies/jwt-access.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtRefreshStrategy } from '@/common/strategies/jwt-refresh.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtService, JwtAccessStrategy, JwtRefreshStrategy],
  imports: [PassportModule],
  exports: [PassportModule],
})
export class AuthModule {}

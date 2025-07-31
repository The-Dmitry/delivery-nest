import { Module } from '@nestjs/common';
import { JwtService } from '@jwt/jwt.service';
import { AuthController } from '@auth/auth.controller';
import { AuthService } from '@auth/auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtRefreshStrategy } from '@/common/strategies/jwt-refresh.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtService, JwtRefreshStrategy],
  imports: [PassportModule],
  exports: [PassportModule],
})
export class AuthModule {}

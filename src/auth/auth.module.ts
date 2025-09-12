import { Module } from '@nestjs/common';
import { JwtService } from '@jwt/jwt.service';
import { AuthController } from '@auth/auth.controller';
import { AuthService } from '@auth/auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtRefreshStrategy } from '@/common/strategies/jwt-refresh.strategy';
import { UsersModule } from '@/users/users.module';
import { JwtAccessStrategy } from '@/common/strategies/jwt-access.strategy';
import { JwtAdminStrategy } from '@/common/strategies/jwt-admin.strategy';
import { CartModule } from '@/cart/cart.module';
@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtService,
    JwtRefreshStrategy,
    JwtAccessStrategy,
    JwtAdminStrategy,
  ],
  imports: [PassportModule, UsersModule, CartModule],
  exports: [PassportModule],
})
export class AuthModule {}

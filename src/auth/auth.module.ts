import { Module } from '@nestjs/common';
import { JwtService } from '@jwt/jwt.service';
import { AuthController } from '@auth/auth.controller';
import { AuthService } from '@auth/auth.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtService],
  imports: [],
})
export class AuthModule {}

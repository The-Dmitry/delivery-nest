import { AuthService } from '@auth/auth.service';
import { CreateLoginDto } from '@auth/dto/login.dto';
import { CreateRegistrationDto } from '@auth/dto/registration.dto';
import { TokenInterceptor } from '@interceptors/token.interceptor';
import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';

@UseInterceptors(TokenInterceptor)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: CreateRegistrationDto) {
    return await this.authService.register(dto);
  }

  @Post('login')
  async login(@Body() dto: CreateLoginDto) {
    return await this.authService.login(dto);
  }

  @Post('refresh')
  async refresh(@Body('refreshToken') refreshToken: string) {
    return await this.authService.refresh(refreshToken);
  }
}

import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateLoginDto } from 'src/auth/dto/login.dto';
import { CreateRegistrationDto } from 'src/auth/dto/registration.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: CreateRegistrationDto) {
    return await this.authService.register(dto);
  }

  @Post('login')
  async login(@Body() dto: CreateLoginDto): Promise<string> {
    return await this.authService.login(dto);
  }
}

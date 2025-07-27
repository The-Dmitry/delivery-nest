import { TokenPayload } from '@/common/decorators/token-payload.decorator';
import { JwtRefreshGuard } from '@/common/guards/jwt-refresh.guard';
import { AuthService } from '@auth/auth.service';
import { CreateLoginDto } from '@auth/dto/login.dto';
import { CreateRegistrationDto } from '@auth/dto/registration.dto';
import { TokenInterceptor } from '@interceptors/token.interceptor';
import { JwtPayload } from '@jwt/models/models';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

@UseInterceptors(TokenInterceptor)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  async register(@Body() dto: CreateRegistrationDto) {
    return await this.authService.register(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() dto: CreateLoginDto) {
    return await this.authService.login(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('anonymous')
  anonymousLogin() {
    return this.authService.anonymousLogin();
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  async refresh(@TokenPayload() payload: JwtPayload) {
    return this.authService.refresh(payload);
  }
}

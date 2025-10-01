import { AnonymousTokenPayload } from '@/common/decorators/anonymous-token-payload.decorator';
import { SerializeResponse } from '@/common/decorators/serialize-response.decorator';
import { TokenPayload } from '@/common/decorators/token-payload.decorator';
import { ErrorResponseDto } from '@/common/dto/error-response.dto';
import { OptionalJwtGuard } from '@/common/guards/jwt-option.guard';
import { JwtRefreshGuard } from '@/common/guards/jwt-refresh.guard';
import { AuthService } from '@auth/auth.service';
import { CreateLoginDto } from '@auth/dto/login.dto';
import { CreateRegistrationDto } from '@auth/dto/registration.dto';
import {
  AuthResponse,
  AuthResponseDto,
} from '@auth/dto/response/auth-response.dto';
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
import {
  ApiBadRequestResponse,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiBadRequestResponse({
  description: 'Bad request',
  type: ErrorResponseDto,
})
// SEQUENCE MATTERS - Interceptor must be before SerializeResponse
@UseInterceptors(TokenInterceptor)
@SerializeResponse(AuthResponseDto)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'User registration',
    description: 'Registers a new user with email and password',
  })
  @ApiCreatedResponse({
    description: 'User successfully registered',
    type: AuthResponse,
  })
  @ApiNotFoundResponse({
    description: 'User not found',
    type: ErrorResponseDto,
  })
  @UseGuards(OptionalJwtGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  async register(
    @Body() dto: CreateRegistrationDto,
    @AnonymousTokenPayload() anonPayload: JwtPayload | null,
  ): Promise<AuthResponseDto> {
    return await this.authService.register(dto, anonPayload);
  }

  @ApiOperation({
    summary: 'User login',
    description: 'Logs in a user with email and password',
  })
  @ApiOkResponse({
    description: 'User successfully logged in',
    type: AuthResponse,
  })
  @ApiNotFoundResponse({
    description: 'User not found',
    type: ErrorResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Email already exists',
    type: ErrorResponseDto,
  })
  @UseGuards(OptionalJwtGuard)
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Body() dto: CreateLoginDto,
    @AnonymousTokenPayload() anonPayload: JwtPayload | null,
  ): Promise<AuthResponseDto> {
    return await this.authService.login(dto, anonPayload);
  }

  @ApiOperation({
    summary: 'Anonymous login',
    description: 'Logs in a user without credentials',
  })
  @ApiOkResponse({
    description: 'Anonymous user successfully logged in',
    type: AuthResponse,
  })
  @HttpCode(HttpStatus.OK)
  @Post('anonymous')
  anonymousLogin(): AuthResponseDto {
    return this.authService.anonymousLogin();
  }

  @ApiOperation({
    summary: 'Refresh token',
    description:
      'Refreshes the user jwt token using the refresh token from cookies',
  })
  @ApiCookieAuth('refresh-token')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtRefreshGuard)
  @ApiCreatedResponse({
    description: 'Token successfully refreshed',
    type: AuthResponse,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid refresh token',
    type: ErrorResponseDto,
  })
  @Post('refresh')
  async refresh(@TokenPayload() payload: JwtPayload): Promise<AuthResponseDto> {
    return this.authService.refresh(payload);
  }
}

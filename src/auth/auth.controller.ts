import { TokenPayload } from '@/common/decorators/token-payload.decorator';
import { JwtRefreshGuard } from '@/common/guards/jwt-refresh.guard';
import { AuthService } from '@auth/auth.service';
import { CreateLoginDto } from '@auth/dto/login.dto';
import { CreateRegistrationDto } from '@auth/dto/registration.dto';
import {
  AuthDtoResponse,
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
import { createResponseDto } from '@utils/createResponseDto';

@ApiBadRequestResponse({
  description: 'Bad request',
  type: AuthDtoResponse.error(),
})
@UseInterceptors(TokenInterceptor)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'User registration',
    description: 'Registers a new user with email and password',
  })
  @ApiCreatedResponse({
    description: 'User successfully registered',
    type: createResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'User not found',
    type: AuthDtoResponse.error(),
  })
  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  async register(@Body() dto: CreateRegistrationDto): Promise<AuthResponseDto> {
    return await this.authService.register(dto);
  }

  @ApiOperation({
    summary: 'User login',
    description: 'Logs in a user with email and password',
  })
  @ApiCreatedResponse({
    description: 'User successfully logged in',
    type: AuthDtoResponse.success(),
  })
  @ApiNotFoundResponse({
    description: 'User not found',
    type: AuthDtoResponse.error(),
  })
  @ApiUnauthorizedResponse({
    description: 'Email already exists',
    type: AuthDtoResponse.error(),
  })
  @HttpCode(HttpStatus.CREATED)
  @Post('login')
  async login(@Body() dto: CreateLoginDto): Promise<AuthResponseDto> {
    return await this.authService.login(dto);
  }

  @ApiOperation({
    summary: 'Anonymous login',
    description: 'Logs in a user without credentials',
  })
  @ApiOkResponse({
    description: 'Anonymous user successfully logged in',
    type: AuthDtoResponse.success(),
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
    type: AuthDtoResponse.success(),
  })
  @Post('refresh')
  async refresh(@TokenPayload() payload: JwtPayload): Promise<AuthResponseDto> {
    return this.authService.refresh(payload);
  }
}

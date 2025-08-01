import { TokenPayload } from '@/common/decorators/token-payload.decorator';
import { JwtRefreshGuard } from '@/common/guards/jwt-refresh.guard';
import { AuthService } from '@auth/auth.service';
import { CreateLoginDto } from '@auth/dto/login.dto';
import { CreateRegistrationDto } from '@auth/dto/registration.dto';
import { AuthResponseDto } from '@auth/dto/response/auth-response.dto';
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
  type: createResponseDto().error('auth', 400, 'Invalid request data'),
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
    type: createResponseDto(AuthResponseDto).success('register', 201),
  })
  @ApiNotFoundResponse({
    description: 'User not found',
    type: createResponseDto().error('register', 404, 'User not found'),
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
    type: createResponseDto(AuthResponseDto).success('login', 201),
  })
  @ApiNotFoundResponse({
    description: 'User not found',
    type: createResponseDto().error('login', 404, 'User not found'),
  })
  @ApiUnauthorizedResponse({
    description: 'Email already exists',
    type: createResponseDto().error(
      'login',
      401,
      'Incorrect email or password',
    ),
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
    type: createResponseDto(AuthResponseDto).success('anonymous', 200),
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
    type: createResponseDto(AuthResponseDto).success('refresh', 201),
  })
  @Post('refresh')
  async refresh(@TokenPayload() payload: JwtPayload): Promise<AuthResponseDto> {
    return this.authService.refresh(payload);
  }
}

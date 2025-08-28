import { JwtService } from '@/jwt/jwt.service';
import { UsersService } from '@/users/users.service';
import type { AuthResponseDto } from '@auth/dto/response/auth-response.dto';
import { JwtPayload } from '@jwt/models/models';
import { Injectable, NotFoundException } from '@nestjs/common';
import { verify } from 'argon2';
import { CreateLoginDto } from 'src/auth/dto/login.dto';
import { CreateRegistrationDto } from 'src/auth/dto/registration.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
    private readonly jwt: JwtService,
  ) {}

  async login({ email, password }: CreateLoginDto): Promise<AuthResponseDto> {
    const user = await this.usersService.findWithParams({ email });
    const isPasswordValid = await verify(user.password, password);
    if (!isPasswordValid) {
      throw new NotFoundException('User not found');
    }
    return this.jwt.generateToken(user.id, false);
  }

  async register(payload: CreateRegistrationDto): Promise<AuthResponseDto> {
    const newUser = await this.usersService.create(payload);
    return this.jwt.generateToken(newUser.id, false);
  }

  anonymousLogin(): AuthResponseDto {
    return this.jwt.generateToken();
  }

  async refresh({ id, anonymous }: JwtPayload): Promise<AuthResponseDto> {
    if (anonymous) {
      return this.jwt.generateToken(id, true);
    }
    const user = await this.usersService.findById(id);
    return this.jwt.generateToken(user.id);
  }
}

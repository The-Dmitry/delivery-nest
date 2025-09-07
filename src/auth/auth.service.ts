import { CartService } from '@/cart/cart.service';
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
    private readonly cartService: CartService,
    private readonly jwt: JwtService,
  ) {}

  async login(
    { email, password }: CreateLoginDto,
    anonPayload: JwtPayload | null,
  ): Promise<AuthResponseDto> {
    const {
      id,
      role,
      password: currentPassword,
    } = await this.usersService.findByEmail(email);
    const isPasswordValid = await verify(currentPassword, password);
    if (!isPasswordValid) {
      throw new NotFoundException('User not found');
    }
    if (anonPayload) {
      await this.cartService.mergeAnonymousCart(anonPayload, id);
    }
    return this.jwt.generateToken({ id, role, anonymous: false });
  }

  async register(
    payload: CreateRegistrationDto,
    anonPayload: JwtPayload | null,
  ): Promise<AuthResponseDto> {
    const { id, role } = await this.usersService.create(payload);
    if (anonPayload) {
      await this.cartService.mergeAnonymousCart(anonPayload, id);
    }
    return this.jwt.generateToken({ id, role, anonymous: false });
  }

  anonymousLogin(): AuthResponseDto {
    return this.jwt.generateToken({ anonymous: true });
  }

  async refresh({ id, anonymous }: JwtPayload): Promise<AuthResponseDto> {
    if (anonymous) {
      return this.jwt.generateToken({ id, anonymous });
    }
    const user = await this.usersService.findById(id);
    return this.jwt.generateToken({
      id: user.id,
      role: user.role,
      anonymous: false,
    });
  }
}

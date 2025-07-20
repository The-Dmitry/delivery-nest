import { JwtService } from '@/jwt/jwt.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { hash, verify } from 'argon2';
import { PrismaClientKnownRequestError } from 'generated/prisma/runtime/library';
import { CreateLoginDto } from 'src/auth/dto/login.dto';
import { CreateRegistrationDto } from 'src/auth/dto/registration.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async login({ email, password }: CreateLoginDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const isPasswordValid = await verify(user.password, password);
      if (!isPasswordValid) {
        throw new NotFoundException('User not found');
      }
      return this.jwt.generateToken(user.id);
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new BadRequestException('Email already exists');
      }
      throw error;
    }
  }

  async register({ email, password }: CreateRegistrationDto) {
    try {
      const newUser = await this.prisma.user.create({
        data: {
          email,
          password: await hash(password),
        },
      });
      if (newUser) {
        return this.jwt.generateToken(newUser.id);
      }
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new BadRequestException('Email already exists');
      }
      throw error;
    }
  }
}

import { JwtService } from '@/jwt/jwt.service';
import { JwtPayload } from '@jwt/models/models';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
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
    return this.jwt.generateToken(user.id, false);
  }

  async register({ email, password }: CreateRegistrationDto) {
    try {
      const newUser = await this.prisma.user.create({
        data: {
          email,
          password: await hash(password),
        },
      });
      return this.jwt.generateToken(newUser.id, false);
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new UnauthorizedException('Email already exists');
      }
      throw error;
    }
  }

  anonymousLogin() {
    return this.jwt.generateToken();
  }

  async refresh({ id, anonymous }: JwtPayload) {
    if (anonymous) {
      return this.jwt.generateToken(id, true);
    }

    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.jwt.generateToken(user.id);
  }
}

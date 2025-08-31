import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from '@prisma/prisma.service';
import { PrismaClientKnownRequestError } from 'generated/prisma/runtime/library';
import { hash } from 'argon2';
import { UserResponseDto } from '@/users/dto/response/users-response.dto';
import { UpdateUserDto } from '@/users/dto/update-user.dto';
import { UsersQueriesDto } from '@/users/dto/users-queries.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateUserDto): Promise<UserResponseDto> {
    try {
      return await this.prisma.user.create({
        data: {
          ...dto,
          password: await hash(dto.password),
        },
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new UnauthorizedException('Email already exists');
      }
      throw new BadRequestException('Failed to register user');
    }
  }

  async findMany({
    name,
    email,
    phone,
    role,
  }: UsersQueriesDto): Promise<UserResponseDto[]> {
    return await this.prisma.user.findMany({
      where: { name, email, phone, role },
    });
  }

  async findByEmail(email: string): Promise<UserResponseDto> {
    try {
      return this.prisma.user.findUniqueOrThrow({ where: { email } });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`User not found.`);
        }
      }
      throw new BadRequestException('Failed to get user');
    }
  }

  async findById(id: string): Promise<UserResponseDto> {
    try {
      return this.prisma.user.findUniqueOrThrow({ where: { id } });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`User not found.`);
        }
      }
      throw new BadRequestException('Failed to get user');
    }
  }

  async update(
    id: string,
    { address, name, password, phone }: UpdateUserDto,
  ): Promise<UserResponseDto> {
    try {
      return await this.prisma.user.update({
        where: { id },
        data: {
          address,
          name,
          password: password ? await hash(password) : undefined,
          phone,
        },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`User not found.`);
        }
      }
      throw new BadRequestException('Failed to update user');
    }
  }
}

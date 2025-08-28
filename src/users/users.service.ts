import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from '@prisma/prisma.service';
import { PrismaClientKnownRequestError } from 'generated/prisma/runtime/library';
import { hash } from 'argon2';
import { Prisma } from 'generated/prisma';
import { UserResponseDto } from '@/users/dto/response/users-response.dto';

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
    id,
    email,
    phone,
  }: Pick<Prisma.UserWhereUniqueInput, 'id' | 'email' | 'phone'>): Promise<
    UserResponseDto[]
  > {
    return await this.prisma.user.findMany({ where: { id, email, phone } });
  }

  async findById(id: string): Promise<UserResponseDto> {
    return await this.findWithParams({ id });
  }

  async findWithParams({
    id,
    email,
    phone,
  }: Pick<
    Prisma.UserWhereUniqueInput,
    'id' | 'email' | 'phone'
  >): Promise<UserResponseDto> {
    try {
      return await this.prisma.user.findUniqueOrThrow({
        where: { id, email, phone },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new BadRequestException(`User not found.`);
        }
      }
      throw new BadRequestException('Failed to get user');
    }
  }

  // async update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  // async remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}

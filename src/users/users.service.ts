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
import { AllUsersQueriesDto } from '@/users/dto/all-users-queries.dto';
import { DeleteResponseDto } from '@/common/dto/delete-response.dto';
import { WithPagination } from '@/common/types/pagination';
import { SingleUserQueriesDto } from '@/users/dto/single-user-queries.dto';

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
    count,
    limit = 20,
    page = 1,
  }: AllUsersQueriesDto): Promise<WithPagination<UserResponseDto>> {
    const where = { name, email, phone, role };
    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        take: limit,
        skip: (page - 1) * limit,
        include: {
          _count: count && {
            select: {
              orders: true,
            },
          },
        },
      }),
      this.prisma.user.count({
        where,
      }),
    ]);
    return {
      data,
      pagination: {
        limit,
        page,
        total,
      },
    };
  }

  async findByEmail(email: string): Promise<UserResponseDto> {
    try {
      return await this.prisma.user.findUniqueOrThrow({ where: { email } });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`User not found.`);
      }
      throw new BadRequestException('Failed to get user');
    }
  }

  async findById(
    id: string,
    queries?: SingleUserQueriesDto,
  ): Promise<UserResponseDto> {
    try {
      return this.prisma.user.findUniqueOrThrow({
        where: { id },
        include: {
          _count: queries?.count && {
            select: {
              orders: true,
            },
          },
        },
      });
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
    { address, name, password, phone, role }: UpdateUserDto,
    adminId?: string,
  ): Promise<UserResponseDto> {
    if (role) {
      this.adminCantChangeHimself(id, adminId);
    }
    try {
      return await this.prisma.user.update({
        where: { id },
        data: {
          address,
          name,
          password: password ? await hash(password) : undefined,
          phone,
          role,
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

  async delete(id: string, adminId: string): Promise<DeleteResponseDto> {
    this.adminCantChangeHimself(id, adminId);
    try {
      await this.prisma.user.delete({ where: { id } });
      return {
        message: `User with id ${id} deleted successfully`,
        deletedId: id,
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`User with id '${id}' not found.`);
        }
      }
      throw new BadRequestException(`Failed to delete user with id: ${id}`);
    }
  }

  private adminCantChangeHimself(id: string, adminId?: string) {
    if (id && adminId) {
      if (id === adminId) {
        throw new UnauthorizedException(
          'You cannot delete yourself or change your role',
        );
      }
    }
  }
}

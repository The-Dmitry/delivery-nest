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
import { JwtPayload } from '@jwt/models/models';
import { Role } from 'generated/prisma';
import isOnlyForAdmin from '@utils/isOnlyForAdmin';

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

  async findMany(
    {
      name,
      email,
      phone,
      role,
      count,
      limit = 20,
      page = 1,
    }: AllUsersQueriesDto,
    jwtPayload: JwtPayload,
  ): Promise<WithPagination<UserResponseDto>> {
    const isAdmin = isOnlyForAdmin(jwtPayload.role);
    const where = {
      email,
      phone,
      role,
    };

    try {
      const [data, total] = await Promise.all([
        this.prisma.user.findMany({
          where: {
            ...where,
            name: name && { contains: name, mode: 'insensitive' },
            role: isAdmin ? role : Role.BOT,
          },
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
          where: {
            ...where,
            name: name && { contains: name, mode: 'insensitive' },
          },
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
    } catch {
      throw new BadRequestException('Failed to get users');
    }
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
    admin?: JwtPayload,
  ): Promise<UserResponseDto> {
    if (role) {
      if (admin?.role !== Role.ROOT) {
        throw new UnauthorizedException('Only root can change user roles');
      }
      if (role?.toUpperCase() === Role.ROOT) {
        throw new BadRequestException('Cannot assign ROOT role');
      }
      this.adminCantChangeHimself(id, admin.id);
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

  async delete(id: string, admin: JwtPayload): Promise<DeleteResponseDto> {
    if (admin.role !== Role.ROOT) {
      throw new UnauthorizedException('Only ROOT admin can delete users');
    }
    this.adminCantChangeHimself(id, admin.id);
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
        throw new BadRequestException(
          'You cannot delete yourself or change your role',
        );
      }
    }
  }
}

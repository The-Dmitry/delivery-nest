import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from '@prisma/prisma.service';
import { Prisma } from 'generated/prisma';
import {
  ResponseCategoryDto,
  ResponseCategoryWithQueries,
} from '@/category/dto/response/response-category.dto';
import { DeleteResponseDto } from '@/common/dto/delete-response.dto';
import { CategoryQueriesDto } from '@/category/dto/category-queries.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async create({
    name,
    linkName,
  }: CreateCategoryDto): Promise<ResponseCategoryDto> {
    try {
      return await this.prisma.category.create({
        data: { name, linkName },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          `Category with name '${name}' already exists.`,
        );
      }
      throw new BadRequestException(`Failed to create category: ${name}`);
    }
  }

  async findAll({
    _count,
    products,
  }: CategoryQueriesDto): Promise<ResponseCategoryWithQueries[]> {
    return await this.prisma.category.findMany({
      include: {
        _count: _count && {
          select: {
            products: true,
          },
        },
        products,
      },
    });
  }

  async findOne(
    id: string,
    { _count, products }: CategoryQueriesDto,
  ): Promise<ResponseCategoryWithQueries> {
    try {
      const category = await this.prisma.category.findUnique({
        where: { id },
        include: {
          _count,
          products,
        },
      });
      if (!category) {
        throw new NotFoundException(`Category with id '${id}' not found.`);
      }
      return category;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new BadRequestException(`Category with id '${id}' not found.`);
      }
      throw error;
    }
  }

  async update(
    id: string,
    { name, linkName, active }: UpdateCategoryDto,
  ): Promise<ResponseCategoryDto> {
    try {
      return await this.prisma.category.update({
        where: { id },
        data: { name, linkName, active },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Category with id '${id}' not found.`);
        }
        if (error.code === 'P2002') {
          throw new ConflictException(
            `Category with name '${name}' already exists.`,
          );
        }
      }
      throw new BadRequestException(`Failed to update category: ${name}`);
    }
  }

  async delete(id: string): Promise<DeleteResponseDto> {
    try {
      await this.prisma.category.delete({
        where: { id },
      });
      return {
        message: `Category with id ${id} deleted successfully`,
        deletedId: id,
      };
    } catch (error) {
      console.error(error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025' || error.code === 'P2003') {
          throw new NotFoundException(`Category with id '${id}' not found.`);
        }
        if (error.code === 'P2026') {
          throw new NotFoundException(
            `Category with id '${id}' has associated products.`,
          );
        }
      }
      throw new BadRequestException(`Failed to delete category with id: ${id}`);
    }
  }
}

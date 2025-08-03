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
import { ResponseCategoryDto } from '@/category/dto/response/response-category.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async create({ name }: CreateCategoryDto): Promise<ResponseCategoryDto> {
    try {
      const newCategory = await this.prisma.category.create({
        data: { name },
      });
      return newCategory;
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

  async findAll(): Promise<ResponseCategoryDto[]> {
    return await this.prisma.category.findMany();
  }

  async findOne(id: string): Promise<ResponseCategoryDto> {
    try {
      const category = await this.prisma.category.findUnique({
        where: { id: String(id) },
      });
      if (!category) {
        throw new NotFoundException(`Category with id "${id}" not found.`);
      }
      return category;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new BadRequestException(`Category with id "${id}" not found.`);
      }
      throw error;
    }
  }

  async update(id: string, { name }: UpdateCategoryDto) {
    try {
      const updatedCategory = await this.prisma.category.update({
        where: { id },
        data: { name },
      });
      return updatedCategory;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Category with id "${id}" not found.`);
        }
        if (error.code === 'P2002') {
          throw new ConflictException(
            `Category with name "${name}" already exists.`,
          );
        }
      }
      throw new BadRequestException(`Failed to update category: ${name}`);
    }
  }

  async remove(id: string): Promise<ResponseCategoryDto> {
    try {
      const deletedCategory = await this.prisma.category.delete({
        where: { id },
      });
      return deletedCategory;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Category with id "${id}" not found.`);
        }
      }
      throw new BadRequestException(`Failed to delete category with id: ${id}`);
    }
  }
}

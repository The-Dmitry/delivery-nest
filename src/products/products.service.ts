import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from '@prisma/prisma.service';
import { PrismaClientKnownRequestError } from 'generated/prisma/runtime/library';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}
  async create({
    id,
    name,
    description,
    images,
    categoryId,
  }: CreateProductDto) {
    const newProduct = await this.prisma.product.create({
      data: {
        id,

        category: {
          connect: {
            id: categoryId,
          },
        },
        name: name,
        description: description,
        images: images,
      },
    });
    return newProduct;
  }

  async findAll() {
    return await this.prisma.product.findMany();
  }

  async findOne(id: string) {
    try {
      return await this.prisma.product.findUniqueOrThrow({ where: { id } });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`Product with id "${id}" not found.`);
      }
      throw new BadRequestException('Failed to find product.');
    }
  }

  async findByCategory(categoryId: string) {
    try {
      const result = await this.prisma.product.findMany({
        where: { categoryId },
      });
      return result;
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(
          `Product with id "${categoryId}" not found.`,
        );
      }
      throw new BadRequestException('Failed to find product.');
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    try {
      const updatedProduct = await this.prisma.product.update({
        where: { id },
        data: updateProductDto,
      });
      return updatedProduct;
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`Product with id "${id}" not found.`);
      }
      throw new BadRequestException('Failed to update product.');
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.product.delete({ where: { id } });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`Product with id "${id}" not found.`);
      }
      throw new BadRequestException('Failed to delete product.');
    }
  }
}

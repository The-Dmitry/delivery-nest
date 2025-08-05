import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from '@prisma/prisma.service';
import { PrismaClientKnownRequestError } from 'generated/prisma/runtime/library';
import { ProductResponseDto } from '@/products/dto/response/product-response.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}
  async create({ name, description, images, categoryId }: CreateProductDto) {
    try {
      const newProduct = await this.prisma.product.create({
        data: {
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
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new BadRequestException(
            `Product with name '${name}' already exists.`,
          );
        }
        if (error.code === 'P2025') {
          throw new NotFoundException('Category not found');
        }
      }
      throw new BadRequestException('Failed to create product.');
    }
  }

  async findAll() {
    return await this.prisma.product.findMany();
  }

  async findOne(id: string) {
    try {
      return await this.prisma.product.findUniqueOrThrow({
        where: { id },
        include: { variants: true },
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`Product with id '${id}' not found.`);
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
          `Product with id '${categoryId}' not found.`,
        );
      }
      throw new BadRequestException('Failed to find product.');
    }
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<ProductResponseDto> {
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
        throw new NotFoundException(`Product with id '${id}' not found.`);
      }
      throw new BadRequestException('Failed to update product.');
    }
  }

  async remove(id: string): Promise<ProductResponseDto> {
    try {
      return await this.prisma.product.delete({ where: { id } });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`Product with id '${id}' not found.`);
      }
      throw new BadRequestException('Failed to delete product.');
    }
  }
}

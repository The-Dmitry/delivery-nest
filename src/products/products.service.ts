import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from '@prisma/prisma.service';
import { PrismaClientKnownRequestError } from 'generated/prisma/runtime/library';
import {
  ProductResponseDto,
  ProductWithCategoryAndVariantsCountDto,
} from '@/products/dto/response/product-response.dto';
import { DeleteResponseDto } from '@/common/dto/delete-response.dto';
import {
  ProductQueriesDto,
  ProductQueriesWithCategoryDto,
} from '@/products/dto/product-queries.dto';
import { JwtPayload } from '@jwt/models/models';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async create({
    name,
    description,
    images,
    categoryId,
  }: CreateProductDto): Promise<ProductResponseDto> {
    try {
      return await this.prisma.product.create({
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

  async findAll(
    {
      _count,
      category,
      variants,
      categoryId,
      showAll,
    }: ProductQueriesWithCategoryDto,
    role?: JwtPayload['role'],
  ): Promise<ProductWithCategoryAndVariantsCountDto[]> {
    const isShowAll = showAll && role === 'ADMIN';
    return await this.prisma.product.findMany({
      where: {
        categoryId,
        active: isShowAll
          ? undefined
          : {
              equals: true,
            },
      },
      include: {
        _count: _count ? { select: { variants: true } } : undefined,
        variants,
        category,
      },
    });
  }

  async findOne(
    id: string,
    { _count, category, variants }: ProductQueriesDto,
  ): Promise<ProductResponseDto> {
    try {
      return await this.prisma.product.findUniqueOrThrow({
        where: { id },
        include: {
          _count: _count
            ? {
                select: {
                  variants: {
                    where: { available: true },
                  },
                },
              }
            : undefined,
          variants,
          category,
        },
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
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Product with id '${id}' not found.`);
        }
        if (error.code === 'P2003') {
          throw new NotFoundException(
            `Category with id '${updateProductDto.categoryId}' not found.`,
          );
        }
      }
      throw new BadRequestException('Failed to update product.');
    }
  }

  async delete(id: string): Promise<DeleteResponseDto> {
    try {
      await this.prisma.product.delete({ where: { id } });
      return {
        message: `Product with id ${id} deleted successfully`,
        deletedId: id,
      };
    } catch (error) {
      console.error(error);

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

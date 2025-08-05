import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateVariantDto } from './dto/create-variant.dto';
import { UpdateVariantDto } from './dto/update-variant.dto';
import { PrismaService } from '@prisma/prisma.service';
import { PrismaClientKnownRequestError } from 'generated/prisma/runtime/library';
import { VariantResponseDto } from '@/variants/dto/response/variants-response.dto';

@Injectable()
export class VariantsService {
  constructor(private readonly prisma: PrismaService) {}
  async create(variant: CreateVariantDto): Promise<VariantResponseDto> {
    try {
      const newVariant = await this.prisma.productVariant.create({
        data: variant,
      });
      return newVariant;
    } catch (error) {
      console.log(error);

      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2003'
      ) {
        throw new NotFoundException(
          `Product with id '${variant.productId}' not found.`,
        );
      }
      throw new BadRequestException('Failed to create product.');
    }
  }

  async findAll(productId?: string): Promise<VariantResponseDto[]> {
    try {
      const where = productId ? { productId } : {};
      return await this.prisma.productVariant.findMany({ where });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2003'
      ) {
        throw new NotFoundException(
          `Variant with product id '${productId}' not found.`,
        );
      }
      throw new BadRequestException('Failed to find variants.');
    }
  }

  async findOne(id: string): Promise<VariantResponseDto> {
    try {
      return await this.prisma.productVariant.findUniqueOrThrow({
        where: { id },
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2003'
      ) {
        throw new NotFoundException(`Variant with id '${id}' not found.`);
      }
      throw new BadRequestException('Failed to find variant.');
    }
  }

  async update(
    id: string,
    updateVariantDto: UpdateVariantDto,
  ): Promise<VariantResponseDto> {
    try {
      const updatedProduct = await this.prisma.productVariant.update({
        where: { id },
        data: updateVariantDto,
      });
      return updatedProduct;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Variant with id '${id}' not found.`);
        }
        if (error.code === 'P2003') {
          throw new NotFoundException(
            `Product with id '${updateVariantDto.productId}' not found.`,
          );
        }
      }
      throw new BadRequestException('Failed to update variant.');
    }
  }

  async remove(id: string) {
    return await this.prisma.productVariant.delete({ where: { id } });
  }
}

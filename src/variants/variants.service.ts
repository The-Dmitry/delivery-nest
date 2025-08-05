import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateVariantDto } from './dto/create-variant.dto';
import { UpdateVariantDto } from './dto/update-variant.dto';
import { PrismaService } from '@prisma/prisma.service';
import { PrismaClientKnownRequestError } from 'generated/prisma/runtime/library';

@Injectable()
export class VariantsService {
  constructor(private readonly prisma: PrismaService) {}
  async create(variant: CreateVariantDto) {
    try {
      const newVariant = await this.prisma.productVariant.create({
        data: variant,
      });
      return newVariant;
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(
          `Product with id "${variant.productId}" not found.`,
        );
      }
      throw new BadRequestException('Failed to create product.');
    }
  }

  async findAll() {
    return await this.prisma.productVariant.findMany();
  }

  async findOne(id: string) {
    try {
      return await this.prisma.productVariant.findUniqueOrThrow({
        where: { id },
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`Variant with id "${id}" not found.`);
      }
      throw new BadRequestException('Failed to find variant.');
    }
  }

  async findByProductId(productId: string) {
    try {
      const result = await this.prisma.productVariant.findMany({
        where: { productId },
      });
      return result;
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(
          `Variant with product id "${productId}" not found.`,
        );
      }
      throw new BadRequestException('Failed to find variants.');
    }
  }

  async update(id: string, updateVariantDto: UpdateVariantDto) {
    try {
      const updatedProduct = await this.prisma.productVariant.update({
        where: { id },
        data: updateVariantDto,
      });
      return updatedProduct;
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`Variant with id "${id}" not found.`);
      }
      throw new BadRequestException('Failed to update variant.');
    }
  }

  async remove(id: string) {
    return await this.prisma.productVariant.delete({ where: { id } });
  }
}

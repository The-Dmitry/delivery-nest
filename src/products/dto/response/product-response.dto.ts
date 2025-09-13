import { ResponseCategoryDto } from '@/category/dto/response/response-category.dto';
import { PaginationResponseDto } from '@/common/dto/pagination-response.dto';
import { VariantResponseDto } from '@/variants/dto/response/variants-response.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { createResponseDto } from '@utils/createResponseDto';
import { Expose, Transform, Type } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { Product } from 'generated/prisma';

export class ProductResponseDto implements Product {
  @ApiProperty({
    example: '2b3c4d5e-6f7g-8h9i-j0k1-l2m3n4o5p6q7',
    description: 'Unique identifier of the product',
  })
  id: string;

  @ApiProperty({
    example: 'Pizza',
    description: 'Name of the product',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    name: 'category_id',
    example: '2b3c4d5e-6f7g-8h9i-j0k1-l2m3n4o5p6q7',
    description:
      'Unique identifier of the category to which the product belongs',
  })
  @Expose({ name: 'category_id', toPlainOnly: true })
  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @ApiProperty({
    example: 'Description of the product',
    description: 'Description of the product',
  })
  @IsString()
  description: string | null;

  @ApiProperty({
    example: [
      'https://example.com/image.jpg',
      'https://example.com/image2.jpg',
    ],
    description: 'Image URL of the product',
  })
  @IsString({ each: true })
  images: string[];

  @ApiProperty({
    name: 'created_at',
    example: '2023-10-01T12:00:00Z',
    description: 'The date and time when the product was created',
  })
  @Expose({ name: 'created_at', toPlainOnly: true })
  createdAt: Date;

  @ApiProperty({
    name: 'updated_at',
    example: '2023-10-01T12:00:00Z',
    description: 'The date and time when the product was last updated',
  })
  @Expose({ name: 'updated_at', toPlainOnly: true })
  updatedAt: Date;

  @ApiProperty({
    example: true,
    description: 'Indicates if the product is active or not',
  })
  active: boolean;
}

export class ProductWithQueries extends ProductResponseDto {
  @ApiPropertyOptional({ type: () => ResponseCategoryDto })
  @Type(() => ResponseCategoryDto)
  category?: ResponseCategoryDto;

  @ApiPropertyOptional({ type: () => VariantResponseDto, isArray: true })
  @Type(() => VariantResponseDto)
  variants?: VariantResponseDto[];

  @ApiPropertyOptional({
    name: 'variants_count',
    example: 2,
    description:
      'Variants count for each product (present only if ?count=true)',
  })
  @Expose({ name: 'variants_count', toPlainOnly: true })
  @Transform(({ value }) => (value as { variants: number })?.variants, {
    toPlainOnly: true,
  })
  _count?: {
    variants: number;
  };
}

export class ProductPaginationResponseDto {
  @ApiProperty({ type: ProductWithQueries, isArray: true })
  data: ProductWithQueries[];

  @ApiProperty({ type: PaginationResponseDto })
  pagination: PaginationResponseDto;
}

export const { ProductResponse } = createResponseDto(
  ProductResponseDto,
  'Product',
);
export const { ProductWithQueriesResponse, ProductWithQueriesArrayResponse } =
  createResponseDto(ProductWithQueries, 'ProductWithQueries');

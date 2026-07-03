import { ProductResponseDto } from '@/products/dto/response/product-response.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { createResponseDto } from '@utils/createResponseDto';
import { Expose, Transform } from 'class-transformer';
import { Category } from 'generated/prisma';

export class ResponseCategoryDto implements Category {
  @ApiProperty({
    example: '2b3c4d5e-6f7g-8h9i-j0k1-l2m3n4o5p6q7',
    description: 'Unique identifier of the category',
  })
  id: string;

  @ApiProperty({
    example: 'Pizza',
    description: 'Name of the category',
  })
  name: string;

  @ApiProperty({
    example: 'pizza',
    description: 'Link name of the category',
  })
  linkName: string;

  @ApiProperty({
    example: true,
    description: 'Indicates if the category is active',
  })
  active: boolean;

  @ApiPropertyOptional({
    example: 'https://example.com/images/pizza.jpg',
    description: 'Image URL for the category',
    type: String,
    nullable: true,
  })
  image: string | null;

  @ApiProperty({
    name: 'created_at',
    example: '2023-10-01T12:00:00Z',
    description: 'The date and time when the category was created',
  })
  @Expose({ name: 'created_at', toPlainOnly: true })
  createdAt: Date;

  @ApiProperty({
    name: 'updated_at',
    example: '2023-10-01T12:00:00Z',
    description: 'The date and time when the category was last updated',
  })
  @Expose({ name: 'updated_at', toPlainOnly: true })
  updatedAt: Date;
}

export class ResponseCategoryWithQueries extends ResponseCategoryDto {
  @ApiPropertyOptional({
    name: 'products_count',
    example: 42,
    description: 'Products count (present only if ?count=true)',
    type: Number,
    nullable: true,
  })
  @Expose({ name: 'products_count', toPlainOnly: true })
  @Transform(({ value }) => (value as { products: number })?.products, {
    toPlainOnly: true,
  })
  _count?: {
    products: number;
  };

  @ApiPropertyOptional({
    type: [ProductResponseDto],
    description:
      'List of products in this category (present only if ?products=true)',
  })
  products?: ProductResponseDto[];
}

export const { CategoryResponse } = createResponseDto(
  ResponseCategoryDto,
  'Category',
);

export const { CategoryWithQueriesArrayResponse, CategoryWithQueriesResponse } =
  createResponseDto(ResponseCategoryWithQueries, 'CategoryWithQueries');

import { ProductResponseDto } from '@/products/dto/response/product-response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { createResponseDto } from '@utils/createResponseDto';
import { Expose, Type } from 'class-transformer';
import { ProductVariant } from 'generated/prisma';
import { Decimal } from 'generated/prisma/runtime/library';

export class VariantResponseDto implements ProductVariant {
  @ApiProperty({
    example: '2b3c4d5e-6f7g-8h9i-j0k1-l2m3n4o5p6q7',
    description: 'Unique identifier of the variant',
  })
  id: string;

  @ApiProperty({
    name: 'product_id',
    example: '2b3c4d5e-6f7g-8h9i-j0k1-l2m3n4o5p6q7',
    description:
      'Unique identifier of the product to which the variant belongs',
  })
  @Expose({ name: 'product_id', toPlainOnly: true })
  productId: string;

  @ApiProperty({
    example: 'Pizza',
    description: 'Name of the variant',
  })
  name: string;

  @ApiProperty({
    example: 'Description of the variant',
    description: 'Description of the variant',
    type: String,
    nullable: true,
  })
  description: string | null;

  @ApiProperty({
    example: 30,
    description: 'Size of the variant',
    type: Number,
    nullable: true,
  })
  size: number | null;

  @ApiProperty({
    example: 300,
    description: 'Weight of the variant in grams',
    type: Number,
    nullable: true,
  })
  weight: number | null;

  @ApiProperty({
    example: '"10.99"',
    description: 'Price of the variant',
    type: String,
  })
  @Type(() => String)
  price: Decimal;

  @ApiProperty({
    example: true,
    description: 'Indicates if the variant is available or not',
  })
  available: boolean;

  @ApiProperty({
    name: 'created_at',
    example: '2023-10-01T12:00:00Z',
    description: 'The date and time when the product variant was created',
  })
  @Expose({ name: 'created_at', toPlainOnly: true })
  createdAt: Date;

  @ApiProperty({
    name: 'updated_at',
    example: '2023-10-01T12:00:00Z',
    description: 'The date and time when the product variant was last updated',
  })
  @Expose({ name: 'updated_at', toPlainOnly: true })
  updatedAt: Date;
}

export class VariantWithProduct extends VariantResponseDto {
  @ApiProperty({
    type: () => ProductResponseDto,
    description: 'Product associated with the variant',
  })
  @Type(() => ProductResponseDto)
  product: ProductResponseDto;
}

export const { VariantArrayResponse, VariantResponse } = createResponseDto(
  VariantResponseDto,
  'Variant',
);

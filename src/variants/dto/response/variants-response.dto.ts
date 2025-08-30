import { ProductResponseDto } from '@/products/dto/response/product-response.dto';
import { ApiProperty } from '@nestjs/swagger';
import {
  createResponseDto,
  createResponseDtoTemp,
} from '@utils/createResponseDto';
import { Expose, Type } from 'class-transformer';
import { IsString, IsNumber } from 'class-validator';
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
  @IsString()
  productId: string;

  @ApiProperty({
    example: 'Pizza',
    description: 'Name of the variant',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Description of the variant',
    description: 'Description of the variant',
  })
  @IsString()
  description: string | null;

  @ApiProperty({
    example: 30,
    description: 'Size of the variant',
  })
  @IsNumber()
  size: number | null;

  @ApiProperty({
    example: 300,
    description: 'Weight of the variant in grams',
  })
  @IsNumber()
  weight: number | null;

  @ApiProperty({
    example: '"10.99"',
    description: 'Price of the variant',
  })
  @Type(() => String)
  price: Decimal;

  @ApiProperty({
    example: true,
    description: 'Indicates if the variant is available or not',
  })
  available: boolean;
}

export class VariantWithProduct extends VariantResponseDto {
  @Type(() => ProductResponseDto)
  @ApiProperty({
    type: () => ProductResponseDto,
    description: 'Product associated with the variant',
  })
  product: ProductResponseDto;
}

export const { VariantArrayResponse, VariantResponse } = createResponseDtoTemp(
  VariantResponseDto,
  'Variant',
);

export const VariantDtoResponse = createResponseDto(
  VariantResponseDto,
  'Variant',
);

export const VariantsArrayDtoResponse = createResponseDto(
  [VariantResponseDto],
  'VariantsArray',
);

import { CreateProductDto } from '@/products/dto/create-product.dto';
import { ApiProperty } from '@nestjs/swagger';
import { createResponseDto } from '@utils/createResponseDto';
import { Product } from 'generated/prisma';

export class ProductResponseDto extends CreateProductDto implements Product {
  @ApiProperty({
    example: '2b3c4d5e-6f7g-8h9i-j0k1-l2m3n4o5p6q7',
    description: 'Unique identifier of the product',
  })
  id: string;

  @ApiProperty({
    example: true,
    description: 'Indicates if the product is active or not',
  })
  active: boolean;

  @ApiProperty({
    example: '2023-10-01T12:00:00Z',
    description: 'The date and time when the product was created',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2023-10-01T12:00:00Z',
    description: 'The date and time when the product was last updated',
  })
  updatedAt: Date;
}

export const ProductDtoResponse = createResponseDto(
  ProductResponseDto,
  'Product',
);

export const ProductsArrayDtoResponse = createResponseDto(
  [ProductResponseDto],
  'ProductsArray',
);

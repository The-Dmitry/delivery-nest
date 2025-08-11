import { ApiProperty } from '@nestjs/swagger';
import { ProductVariant } from 'generated/prisma';
import { Decimal } from 'generated/prisma/runtime/library';

export class ProductVariantResponseDto implements ProductVariant {
  @ApiProperty({
    example: '2b3c4d5e-6f7g-8h9i-j0k1-l2m3n4o5p6q7',
    description: 'Unique identifier of the product variant',
  })
  id: string;

  @ApiProperty({
    example: '2b3c4d5e-6f7g-8h9i-j0k1-l2m3n4o5p6q7',
    description:
      'Unique identifier of the product to which the variant belongs',
  })
  productId: string;

  @ApiProperty({
    example: '30 cm',
    description: 'Name of the variant',
  })
  name: string;

  @ApiProperty({
    example: '30 cm',
    description: 'Description of the variant',
  })
  description: string | null;

  @ApiProperty({
    example: 30,
    description: 'Size of the variant in cm',
  })
  size: number | null;

  @ApiProperty({
    example: 700,
    description: 'Weight of the variant in grams',
  })
  weight: number | null;

  @ApiProperty({
    example: 1000,
    description: 'Price of the variant',
  })
  price: Decimal;

  @ApiProperty({
    example: true,
    description: 'Availability of the variant',
  })
  available: boolean;
}

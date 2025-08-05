import { ApiProperty } from '@nestjs/swagger';
import { IsDecimal, IsNumber, IsString } from 'class-validator';
import { ProductVariant } from 'generated/prisma';
import { Decimal } from 'generated/prisma/runtime/library';

export class CreateVariantDto implements Omit<ProductVariant, 'id'> {
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
    example: '2b3c4d5e-6f7g-8h9i-j0k1-l2m3n4o5p6q7',
    description:
      'Unique identifier of the product to which the variant belongs',
  })
  @IsString()
  productId: string;

  @ApiProperty({
    example: '30 cm',
    description: 'Size of the variant',
  })
  @IsNumber()
  size: number | null;

  @ApiProperty({
    example: '300',
    description: 'Weight of the variant in grams',
  })
  @IsNumber()
  weight: number | null;

  @ApiProperty({
    example: '10.99',
    description: 'Price of the variant',
  })
  @IsDecimal()
  price: Decimal;

  @ApiProperty({
    example: true,
    description: 'Indicates if the variant is available or not',
  })
  available: boolean;
}

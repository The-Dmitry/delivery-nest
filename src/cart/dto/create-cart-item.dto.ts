import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { CartItem, ProductVariant } from 'generated/prisma';

export class CreateCartItemDto {
  @ApiProperty({
    example: '2b3c4d5e-6f7g-8h9i-j0k1-l2m3n4o5p6q7',
    description:
      'Unique identifier of the product to which the variant belongs',
  })
  @IsString()
  variantId: ProductVariant['id'];

  @ApiProperty({
    example: 1,
    description: 'Quantity of the product to add to the cart',
  })
  @IsNumber()
  quantity: CartItem['quantity'];
}

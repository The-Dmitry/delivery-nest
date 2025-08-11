import { ProductVariantResponseDto } from '@/cart/dto/response/product-variant-response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { createResponseDto } from '@utils/createResponseDto';
import { CartItem } from 'generated/prisma';

export class CartItemResponseDto implements CartItem {
  @ApiProperty({
    example: '2b3c4d5e-6f7g-8h9i-j0k1-l2m3n4o5p6q7',
    description: 'Unique identifier of the cart item',
  })
  id: string;

  @ApiProperty({
    example: '2b3c4d5e-6f7g-8h9i-j0k1-l2m3n4o5p6q7',
    description: 'Unique identifier of the cart to which the cart item belongs',
  })
  cartId: string;

  @ApiProperty({
    example: '2b3c4d5e-6f7g-8h9i-j0k1-l2m3n4o5p6q7',
    description:
      'Unique identifier of the product variant to which the cart item belongs',
  })
  productVariantId: string;

  @ApiProperty({
    example: 1,
    description: 'Quantity of the product variant in the cart item',
  })
  quantity: number;

  @ApiProperty({
    example: '2022-01-01T00:00:00.000Z',
    description: 'The date and time when the cart item was created',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2022-01-01T00:00:00.000Z',
    description: 'The date and time when the cart item was last updated',
  })
  updatedAt: Date;

  @ApiProperty({
    type: ProductVariantResponseDto,
    description: 'Product variant associated with the cart item',
  })
  productVariant: ProductVariantResponseDto;
}

export const CartItemDtoResponse = createResponseDto(
  CartItemResponseDto,
  'CartItem',
);

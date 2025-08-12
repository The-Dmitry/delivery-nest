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
    name: 'cart_id',
    example: '2b3c4d5e-6f7g-8h9i-j0k1-l2m3n4o5p6q7',
    description: 'Unique identifier of the cart to which the cart item belongs',
  })
  cartId: string;

  @ApiProperty({
    name: 'product_variant_id',
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
    name: 'product_variant',
    type: ProductVariantResponseDto,
    description: 'Product variant associated with the cart item',
  })
  productVariant: ProductVariantResponseDto;
}

export const CartItemDtoResponse = createResponseDto(
  CartItemResponseDto,
  'CartItem',
);

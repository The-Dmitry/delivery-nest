import { VariantResponseDto } from '@/variants/dto/response/variants-response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { createResponseDto } from '@utils/createResponseDto';
import { Expose, Type } from 'class-transformer';
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
  @Expose({ name: 'cart_id', toPlainOnly: true })
  cartId: string;

  @ApiProperty({
    name: 'product_variant_id',
    example: '2b3c4d5e-6f7g-8h9i-j0k1-l2m3n4o5p6q7',
    description:
      'Unique identifier of the product variant to which the cart item belongs',
  })
  @Expose({ name: 'product_variant_id', toPlainOnly: true })
  productVariantId: string;

  @ApiProperty({
    example: 1,
    description: 'Quantity of the product variant in the cart item',
  })
  quantity: number;

  @ApiProperty({
    name: 'product_variant',
    type: () => VariantResponseDto,
    description: 'Product variant associated with the cart item',
  })
  @Type(() => VariantResponseDto)
  @Expose({ name: 'product_variant', toPlainOnly: true })
  productVariant: VariantResponseDto;
}

export const CartItemDtoResponse = createResponseDto(
  CartItemResponseDto,
  'CartItem',
);

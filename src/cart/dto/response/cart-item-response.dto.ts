import { VariantWithProduct } from '@/variants/dto/response/variants-response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { createResponseDtoTemp } from '@utils/createResponseDto';
import { Exclude, Expose, Type } from 'class-transformer';
import { CartItem } from 'generated/prisma';

export class CartItemResponseDto implements CartItem {
  @ApiProperty({
    example: '2b3c4d5e-6f7g-8h9i-j0k1-l2m3n4o5p6q7',
    description: 'Unique identifier of the cart item',
  })
  id: string;

  @Exclude()
  cartId: string;

  @Exclude()
  productVariantId: string;

  @ApiProperty({
    example: 1,
    description: 'Quantity of the product variant in the cart item',
  })
  quantity: number;

  @ApiProperty({
    name: 'product_variant',
    type: () => VariantWithProduct,
    description: 'Product variant associated with the cart item',
  })
  @Expose({ name: 'product_variant', toPlainOnly: true })
  @Type(() => VariantWithProduct)
  productVariant: VariantWithProduct;
}

export const { CartItemResponse } = createResponseDtoTemp(
  CartItemResponseDto,
  'CartItem',
);

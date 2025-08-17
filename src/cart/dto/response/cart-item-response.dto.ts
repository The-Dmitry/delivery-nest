import { CartProductDtoResponse } from '@/cart/dto/response/cart-product-response.dto';
import { CartItemResponse } from '@/cart/models/models';
import { VariantResponseDto } from '@/variants/dto/response/variants-response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { createResponseDto } from '@utils/createResponseDto';
import { Expose, Type } from 'class-transformer';

export class CartItemResponseDto implements CartItemResponse {
  @ApiProperty({
    example: '2b3c4d5e-6f7g-8h9i-j0k1-l2m3n4o5p6q7',
    description: 'Unique identifier of the cart item',
  })
  id: string;

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

  @ApiProperty({
    name: 'product',
    type: () => CartProductDtoResponse,
    description: 'Product associated with the cart item',
  })
  @Type(() => CartProductDtoResponse)
  product: CartProductDtoResponse;
}

export const CartItemDtoResponse = createResponseDto(
  CartItemResponseDto,
  'CartItem',
);

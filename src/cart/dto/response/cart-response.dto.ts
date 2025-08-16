import { CartItemResponseDto } from '@/cart/dto/response/cart-item-response.dto';
import { CartResponse } from '@/cart/models/models';
import { ApiProperty } from '@nestjs/swagger';
import { createResponseDto } from '@utils/createResponseDto';
import { Type } from 'class-transformer';

export class CartResponseDto implements CartResponse {
  @ApiProperty({
    example: '2b3c4d5e-6f7g-8h9i-j0k1-l2m3n4o5p6q7',
    description: 'Unique identifier of the cart',
  })
  id: string;

  @ApiProperty({
    type: () => CartItemResponseDto,
    isArray: true,
    description: 'List of items in the cart',
  })
  @Type(() => CartItemResponseDto)
  items: CartItemResponseDto[];
}

export const CartDtoResponse = createResponseDto(CartResponseDto, 'Cart');

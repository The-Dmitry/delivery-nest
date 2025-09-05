import { CartItemResponseDto } from '@/cart/dto/response/cart-item-response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { createResponseDto } from '@utils/createResponseDto';
import { Expose, Type } from 'class-transformer';
import { Cart } from 'generated/prisma';

export class CartResponseDto implements Cart {
  @ApiProperty({
    example: '2b3c4d5e-6f7g-8h9i-j0k1-l2m3n4o5p6q7',
    description: 'Unique identifier of the cart',
  })
  id: string;

  @ApiProperty({
    example: '2b3c4d5e-6f7g-8h9i-j0k1-l2m3n4o5p6q7',
    description: 'Unique identifier of the user to which the cart belongs',
  })
  @Expose({ name: 'user_id', toPlainOnly: true })
  userId: string | null;

  @ApiProperty({
    example: '2b3c4d5e-6f7g-8h9i-j0k1-l2m3n4o5p6q7',
    description:
      'Unique identifier of the anonymous user to which the cart belongs',
  })
  @Expose({ name: 'anonymous_user_id', toPlainOnly: true })
  anonymousUserId: string | null;

  @ApiProperty({
    example: '2022-01-01T00:00:00.000Z',
    description: 'The date and time when the cart was created',
  })
  @Expose({ name: 'created_at', toPlainOnly: true })
  createdAt: Date;

  @ApiProperty({
    example: '2022-01-01T00:00:00.000Z',
    description: 'The date and time when the cart was last updated',
  })
  @Expose({ name: 'updated_at', toPlainOnly: true })
  updatedAt: Date;

  @ApiProperty({
    type: () => CartItemResponseDto,
    isArray: true,
    description: 'List of items in the cart',
  })
  @Type(() => CartItemResponseDto)
  items: CartItemResponseDto[];
}
export const { CartResponse } = createResponseDto(CartResponseDto, 'Cart');

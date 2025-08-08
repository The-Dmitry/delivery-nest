import { CartItemResponseDto } from '@/cart/dto/response/cart-item-response.dto';
import { ApiProperty } from '@nestjs/swagger';
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
  userId: string | null;

  @ApiProperty({
    example: '2b3c4d5e-6f7g-8h9i-j0k1-l2m3n4o5p6q7',
    description:
      'Unique identifier of the anonymous user to which the cart belongs',
  })
  anonymousUserId: string | null;

  @ApiProperty({
    example: '2022-01-01T00:00:00.000Z',
    description: 'The date and time when the cart was created',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2022-01-01T00:00:00.000Z',
    description: 'The date and time when the cart was last updated',
  })
  updatedAt: Date;

  @ApiProperty({
    type: [CartItemResponseDto],
    description: 'List of items in the cart',
  })
  items: CartItemResponseDto[];
}

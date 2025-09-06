import { ResponseOrderItemDto } from '@/orders/dto/response/response-order-item.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { createResponseDto } from '@utils/createResponseDto';
import { Expose, Type } from 'class-transformer';
import { Order, OrderStatus } from 'generated/prisma';
import { Decimal } from 'generated/prisma/runtime/library';

export class ResponseOrderDto implements Order {
  @ApiProperty({
    description: 'The unique identifier of the order',
    example: '2b3c4d5e-6f7g-8h9i-j0k1-l2m3n4o5p6q7',
  })
  id: string;

  @ApiProperty({
    description: 'The ID of the user who placed the order',
    example: '2b3c4d5e-6f7g-8h9i-j0k1-l2m3n4o5p6q7',
    nullable: true,
    name: 'user_id',
  })
  @Expose({ name: 'user_id', toPlainOnly: true })
  userId: string | null;

  @ApiProperty({
    description: 'The delivery address for the order',
    example: '123 Main St, Springfield, IL 62701',
  })
  address: string;

  @ApiProperty({
    description: 'The comment for the order',
    example: 'Please deliver it asap',
  })
  comment: string | null;

  @ApiProperty({
    description: 'The name of the person who placed the order',
    example: 'John Doe',
  })
  name: string;

  @ApiProperty({
    description: 'The phone number of the person who placed the order',
    example: '555-555-5555',
  })
  phone: string;

  @ApiProperty({
    description: 'The ID of the anonymous user who placed the order',
    example: '2b3c4d5e-6f7g-8h9i-j0k1-l2m3n4o5p6q7',
    nullable: true,
    name: 'anonymous_user_id',
  })
  @Expose({ name: 'anonymous_user_id', toPlainOnly: true })
  anonymousUserId: string | null;

  @ApiProperty({
    description: 'The order number',
    example: 1001,
    name: 'order_number',
  })
  @Expose({ name: 'order_number', toPlainOnly: true })
  orderNumber: number;

  @ApiProperty({
    description: 'The current status of the order',
    example: 'PENDING',
  })
  status: OrderStatus;

  @ApiProperty({
    description: 'Whether the order was canceled by the user',
    example: true,
  })
  @Expose({ name: 'canceled_by_user', toPlainOnly: true })
  canceledByUser: boolean;

  @ApiProperty({
    description: 'The total amount for the order',
    example: '59.99',
  })
  @Type(() => String)
  total: Decimal;

  @ApiProperty({
    description: 'The date and time when the order was last updated',
    example: '2023-10-02T12:34:56.789Z',
    name: 'updated_at',
  })
  @Expose({ name: 'updated_at', toPlainOnly: true })
  updatedAt: Date;

  @ApiProperty({
    description: 'The date and time when the order was created',
    example: '2023-10-01T12:34:56.789Z',
    name: 'created_at',
  })
  @Expose({ name: 'created_at', toPlainOnly: true })
  createdAt: Date;
}

export class OrderWithItemsResponseDto extends ResponseOrderDto {
  @ApiPropertyOptional({
    description: 'The items included in the order',
    type: [ResponseOrderItemDto],
  })
  @Type(() => ResponseOrderItemDto)
  items?: ResponseOrderItemDto[];
}

export const { OrderResponse, OrderArrayResponse } = createResponseDto(
  ResponseOrderDto,
  'Order',
);

export const { OrderWithItemsResponse, OrderWithItemsArrayResponse } =
  createResponseDto(OrderWithItemsResponseDto, 'OrderWithItems');

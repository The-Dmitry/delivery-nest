import { VariantWithProduct } from '@/variants/dto/response/variants-response.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { createResponseDtoTemp } from '@utils/createResponseDto';
import { Expose, Type } from 'class-transformer';
import { OrderItem, OrderStatus } from 'generated/prisma';
import { Decimal } from 'generated/prisma/runtime/library';

export class ResponseOrderItemDto implements OrderItem {
  @ApiProperty({
    description: 'The unique identifier of the order item',
    example: '2b3c4d5e-6f7g-8h9i-j0k1-l2m3n4o5p6q7',
  })
  id: string;

  @ApiProperty({
    description: 'The ID of the order to which this item belongs',
    example: '2b3c4d5e-6f7g-8h9i-j0k1-l2m3n4o5p6q7',
    name: 'order_id',
  })
  @Expose({ name: 'order_id', toPlainOnly: true })
  orderId: string;

  @ApiProperty({
    description: 'The ID of the product variant for this order item',
    example: '2b3c4d5e-6f7g-8h9i-j0k1-l2m3n4o5p6q7',
    name: 'product_variant_id',
  })
  @Expose({ name: 'product_variant_id', toPlainOnly: true })
  productVariantId: string;

  @ApiProperty({
    description: 'The quantity of the product variant ordered',
    example: 2,
  })
  quantity: number;

  @ApiProperty({
    description: 'The price per single item of the product variant',
    example: '29.99',
    type: Decimal,
    name: 'single_item_price',
  })
  @Expose({ name: 'single_item_price', toPlainOnly: true })
  @Type(() => String)
  singleItemPrice: Decimal;

  @ApiProperty({
    description:
      'The total price for this order item (singleItemPrice * quantity)',
    example: '59.98',
  })
  @Type(() => String)
  total: Decimal;

  @ApiProperty({
    description: 'The current status of the order item',
    example: '2023-10-02T12:34:56.789Z',
  })
  status: OrderStatus;

  @ApiPropertyOptional({
    description: 'Product variant details',
    type: VariantWithProduct,
    name: 'product_variant',
  })
  @Expose({ name: 'product_variant', toPlainOnly: true })
  @Type(() => VariantWithProduct)
  productVariant?: VariantWithProduct;
}

export const { OrderItemResponse, OrderItemArrayResponse } =
  createResponseDtoTemp(ResponseOrderItemDto, 'OrderItem');

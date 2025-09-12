import { ApiProperty } from '@nestjs/swagger';
import {
  IsDecimal,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { OrderItem, OrderStatus } from 'generated/prisma';
import { Decimal } from 'generated/prisma/runtime/library';

export class UpdateOrderItemDto
  implements Partial<Pick<OrderItem, 'quantity' | 'status' | 'singleItemPrice'>>
{
  @ApiProperty({
    description: 'The quantity of the item to update',
    example: 2,
  })
  @IsNumber()
  @IsOptional()
  @Min(1)
  quantity?: number;

  @ApiProperty({
    description: 'The status of the item',
    example: 'PENDING',
  })
  @IsString()
  @IsOptional()
  status?: OrderStatus;

  @ApiProperty({
    description: 'The price of a single item',
    example: '19.99',
    type: Decimal,
  })
  @IsDecimal()
  @IsOptional()
  singleItemPrice?: Decimal;
}

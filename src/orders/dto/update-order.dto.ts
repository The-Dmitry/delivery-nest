import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { Order, OrderStatus } from 'generated/prisma';

export class UpdateOrderDto implements Partial<Pick<Order, 'status'>> {
  @ApiProperty({
    description: 'The status of the order',
    example: 'PENDING',
  })
  @IsEnum(OrderStatus)
  @IsOptional()
  status?: OrderStatus;
}

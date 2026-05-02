import { ToBoolean } from '@/common/decorators/to-boolean.decorator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Order, OrderStatus } from 'generated/prisma';

export class UpdateOrderDto
  implements
    Partial<Pick<Order, 'status' | 'address' | 'phone' | 'canceledByUser'>>
{
  @ApiPropertyOptional({
    description: 'The status of the order',
    example: 'PENDING',
    enum: OrderStatus,
  })
  @IsEnum(OrderStatus)
  @IsOptional()
  status?: OrderStatus;

  @ApiPropertyOptional({
    description: 'The status of the order',
    example: 'true',
  })
  @IsOptional()
  @ToBoolean({ includeNegative: true })
  canceledByUser?: boolean;

  @ApiPropertyOptional({
    description: 'The delivery address for the order',
    example: '123 Main St, Springfield, IL 62701',
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({
    description: 'The phone number for the order',
    example: '375441122333',
  })
  @IsOptional()
  @IsString()
  phone?: string;
}

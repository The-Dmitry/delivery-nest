import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Order, OrderStatus } from 'generated/prisma';

export class UpdateOrderDto
  implements Partial<Pick<Order, 'status' | 'address' | 'phone'>>
{
  @ApiProperty({
    description: 'The status of the order',
    example: 'PENDING',
  })
  @IsEnum(OrderStatus)
  @IsOptional()
  status?: OrderStatus;

  @ApiProperty({
    description: 'The delivery address for the order',
    example: '123 Main St, Springfield, IL 62701',
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({
    description: 'The phone number for the order',
    example: '375441122333',
  })
  @IsOptional()
  @IsString()
  phone?: string;
}

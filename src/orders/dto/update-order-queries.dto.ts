import { ToBoolean } from '@/common/decorators/to-boolean.decorator';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class UpdateOrderQueriesDto {
  @ApiProperty({
    description: 'Update order items',
    example: true,
  })
  @IsOptional()
  @ToBoolean()
  @Expose({ name: 'update_items' })
  updateItems?: boolean;
}

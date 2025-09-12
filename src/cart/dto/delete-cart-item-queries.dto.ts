import { ToBoolean } from '@/common/decorators/to-boolean.decorator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class DeleteCartItemQueriesDto {
  @ApiPropertyOptional({
    description: 'Filter by available',
    example: true,
    required: false,
    type: Boolean,
  })
  @IsOptional()
  @ToBoolean({ includeNegative: true })
  available?: boolean;
}

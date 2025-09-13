import { ToBoolean } from '@/common/decorators/to-boolean.decorator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class SingleUserQueriesDto {
  @ApiPropertyOptional({
    description: 'Include product count for each category',
    type: Boolean,
    example: true,
    name: 'count',
  })
  @IsOptional()
  @ToBoolean()
  count?: boolean;
}

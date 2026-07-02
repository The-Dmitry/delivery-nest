import { ToBoolean } from '@/common/decorators/to-boolean.decorator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class CategoryQueriesDto {
  @ApiPropertyOptional({
    description: 'Include product count for each category',
    type: Boolean,
    example: true,
    name: 'count',
  })
  @IsOptional()
  @ToBoolean()
  @Expose({ name: 'count' })
  _count?: boolean;

  @ApiPropertyOptional({
    description: 'Include products data for each category',
    type: Boolean,
    example: false,
  })
  @IsOptional()
  @ToBoolean()
  products?: boolean;

  @ApiPropertyOptional({
    name: 'show_all',
    description: 'Show all categories (default: false, true is only for admin)',
    type: Boolean,
    example: true,
    required: false,
  })
  @ToBoolean()
  @IsOptional()
  @Expose({ name: 'show_all' })
  showAll?: boolean;
}

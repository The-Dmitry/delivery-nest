import { ToBoolean } from '@/common/decorators/to-boolean.decorator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class VariantsQueriesDto {
  @ApiPropertyOptional({
    name: 'product_id',
    description: 'Filter variants by product ID',
    type: String,
    example: '2b3c4d5e-6f7g-8h9i-j0k1-l2m3n4o5p6q7',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Expose({ name: 'product_id' })
  productId?: string;

  @ApiPropertyOptional({
    name: 'show_all',
    description: 'Show all variants (default: false, true is only for admin)',
    type: Boolean,
    example: true,
    required: false,
  })
  @ToBoolean()
  @IsOptional()
  @Expose({ name: 'show_all' })
  showAll?: boolean;
}

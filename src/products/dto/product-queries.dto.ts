import { ToBoolean } from '@/common/decorators/to-boolean.decorator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class ProductQueriesDto {
  @ApiPropertyOptional({
    description: 'Include product variants count for each product',
    type: Boolean,
    example: true,
    name: 'count',
  })
  @IsOptional()
  @ToBoolean()
  @Expose({ name: 'count' })
  _count?: boolean;

  @ApiPropertyOptional({
    description: 'Include variants data for each product',
    type: Boolean,
    example: false,
  })
  @IsOptional()
  @ToBoolean()
  variants?: boolean;

  @ApiPropertyOptional({
    description: 'Include category data for each product',
    type: Boolean,
    example: false,
  })
  @IsOptional()
  @ToBoolean()
  category?: boolean;
}

export class ProductQueriesWithCategoryDto extends ProductQueriesDto {
  @ApiPropertyOptional({
    name: 'category_id',
    description: 'Filter products by category ID',
    type: String,
    example: '2b3c4d5e-6f7g-8h9i-j0k1-l2m3n4o5p6q7',
  })
  @IsOptional()
  @Expose({ name: 'category_id' })
  categoryId?: string;
}

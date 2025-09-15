import { ToBoolean } from '@/common/decorators/to-boolean.decorator';
import { PaginationQueriesDto } from '@/common/dto/pagination-queries.dto';
import { ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsOptional, IsUUID } from 'class-validator';

export class ProductQueries {
  @ApiPropertyOptional({
    description: 'Include product variants count for each product',
    type: Boolean,
    example: true,
    name: 'count',
  })
  @IsOptional()
  @ToBoolean()
  count?: boolean;

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

export class AllProductsQueries extends IntersectionType(
  ProductQueries,
  PaginationQueriesDto,
) {
  @ApiPropertyOptional({
    name: 'category_id',
    description: 'Filter products by category ID (UUID)',
    type: String,
    example: '2b3c4d5e-6f7g-8h9i-j0k1-l2m3n4o5p6q7',
  })
  @IsUUID()
  @IsOptional()
  @Expose({ name: 'category_id' })
  categoryId?: string;

  @ApiPropertyOptional({
    name: 'show_all',
    description:
      'Show all products (inactive as well) (default: false, true is only for admin)',
    type: Boolean,
    example: true,
    required: false,
  })
  @ToBoolean()
  @IsOptional()
  @Expose({ name: 'show_all' })
  showAll?: boolean;
}

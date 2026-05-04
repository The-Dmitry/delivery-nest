import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsOptional, IsUUID } from 'class-validator';

export class VariantsQueriesDto {
  @ApiPropertyOptional({
    name: 'product_id',
    description: 'Filter variants by product ID',
    type: String,
    example: '2b3c4d5e-6f7g-8h9i-j0k1-l2m3n4o5p6q7',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  @Expose({ name: 'product_id' })
  productId?: string;
}

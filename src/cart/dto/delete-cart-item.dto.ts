import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class DeleteInactiveItemsDto {
  @ApiPropertyOptional({
    description: 'Product ID',
    type: String,
    example: '2b3c4d5e-6f7g-8h9i-j0k1-l2m3n4o5p6q7',
    required: false,
  })
  @IsString()
  @IsOptional()
  productId?: string;

  @ApiPropertyOptional({
    description: 'Variant ID',
    type: String,
    example: '2b3c4d5e-6f7g-8h9i-j0k1-l2m3n4o5p6q7',
    required: false,
  })
  @IsString()
  @IsOptional()
  variantId?: string;
}

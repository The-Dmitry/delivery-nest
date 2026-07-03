import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';
import { Product } from 'generated/prisma';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateProductDto
  extends PartialType(CreateProductDto)
  implements Partial<Product>
{
  @ApiPropertyOptional({
    example: true,
    description: 'Active status of the product',
  })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}

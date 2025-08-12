import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';
import { Product } from 'generated/prisma';
import { IsBoolean } from 'class-validator';

export class UpdateProductDto
  extends PartialType(CreateProductDto)
  implements Partial<Product>
{
  @ApiProperty({ example: true, description: 'Active status of the product' })
  @IsBoolean()
  active: boolean;
}

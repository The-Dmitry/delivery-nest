import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateVariantDto } from './create-variant.dto';
import { ProductVariant } from 'generated/prisma';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateVariantDto
  extends PartialType(CreateVariantDto)
  implements Partial<Omit<ProductVariant, 'id'>>
{
  @ApiProperty({
    example: true,
    description: 'Price of the variant',
  })
  @ApiProperty({
    example: true,
    description: 'Indicates if the variant is available or not',
  })
  @IsOptional()
  @IsBoolean()
  available?: boolean;
}

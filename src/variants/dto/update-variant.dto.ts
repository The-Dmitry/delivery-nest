import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateVariantDto } from './create-variant.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateVariantDto extends PartialType(CreateVariantDto) {
  @ApiPropertyOptional({
    example: true,
    description: 'Price of the variant',
  })
  @ApiPropertyOptional({
    example: true,
    description: 'Indicates if the variant is available or not',
  })
  @IsOptional()
  @IsBoolean()
  available?: boolean;
}

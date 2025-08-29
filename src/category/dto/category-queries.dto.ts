import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';

export class CategoryQueriesDto {
  @ApiPropertyOptional({
    description: 'Include product count for each category',
    type: Boolean,
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  count?: boolean;

  @ApiPropertyOptional({
    description: 'Include products data for each category',
    type: Boolean,
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  products?: boolean;
}

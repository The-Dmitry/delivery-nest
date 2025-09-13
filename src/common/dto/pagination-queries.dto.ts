import { Pagination } from '@/common/types/pagination';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, Min, IsOptional, Max } from 'class-validator';

export class PaginationQueriesDto
  implements Partial<Omit<Pagination, 'total'>>
{
  @ApiPropertyOptional({
    description: 'Page number (default: 1)',
    example: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number;

  @ApiPropertyOptional({
    description: 'Number of items per page (default: 10, max: 100)',
    example: 10,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  limit?: number;
}

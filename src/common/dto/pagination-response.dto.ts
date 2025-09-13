import { Pagination } from '@/common/types/pagination';
import { ApiProperty } from '@nestjs/swagger';

export class PaginationResponseDto
  implements Omit<Pagination, 'order' | 'sort'>
{
  @ApiProperty({
    description: 'Page number (default: 1)',
    example: 1,
  })
  page: number;

  @ApiProperty({
    description: 'Number of items per page (default: 10, max: 100)',
    example: 10,
  })
  limit: number;

  @ApiProperty({
    description: 'Total number of items',
    example: 10,
  })
  total: number;
}

import { PaginationResponseDto } from '@/common/dto/pagination-response.dto';
import { ApiProperty } from '@nestjs/swagger';

export class ResultWithPagination {
  @ApiProperty({
    type: () => PaginationResponseDto,
    description: 'Pagination data',
  })
  pagination: PaginationResponseDto;
}

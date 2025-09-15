import { PaginationQueriesDto } from '@/common/dto/pagination-queries.dto';
import { ManyOrdersQueryDto } from '@/orders/dto/orders-queries.dto';
import { IntersectionType, PickType } from '@nestjs/swagger';

export class MeOrdersQueryDto extends IntersectionType(
  PaginationQueriesDto,
  PickType(ManyOrdersQueryDto, [
    'from',
    'to',
    'status',
    'items',
    'product',
    'variant',
    'variant',
  ]),
) {}

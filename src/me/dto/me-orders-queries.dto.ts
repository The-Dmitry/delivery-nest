import { ManyOrdersQueryDto } from '@/orders/dto/orders-queries.dto';
import { PickType } from '@nestjs/swagger';

export class MeOrdersQueryDto extends PickType(ManyOrdersQueryDto, [
  'from',
  'to',
  'status',
  'items',
  'product',
  'variant',
  'variant',
]) {}

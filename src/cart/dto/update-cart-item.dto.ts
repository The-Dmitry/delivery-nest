import { CreateCartItemDto } from '@/cart/dto/create-cart-item.dto';
import { PickType } from '@nestjs/swagger';

export class UpdateCartItemDto extends PickType(CreateCartItemDto, [
  'quantity',
]) {}

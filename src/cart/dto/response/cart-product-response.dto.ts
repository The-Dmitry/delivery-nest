import { CartProduct } from '@/cart/models/models';
import { ProductResponseDto } from '@/products/dto/response/product-response.dto';
import { PickType } from '@nestjs/swagger';

export class CartProductDtoResponse
  extends PickType(ProductResponseDto, ['id', 'name', 'description', 'images'])
  implements CartProduct {}

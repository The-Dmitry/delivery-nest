import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { FilteredCart } from '@/cart/models/models';
import { CartItemResponseDto } from '@/cart/dto/response/cart-item-response.dto';

function transformItems(
  item: FilteredCart['items'][number],
): CartItemResponseDto {
  const { product, ...rest } = item.productVariant;
  return {
    ...item,
    productVariant: rest,
    product,
  };
}

@Injectable()
export class FormatItemsInterceptor<
  T extends FilteredCart | FilteredCart['items'][number],
> implements NestInterceptor<T, any>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<unknown> {
    return next.handle().pipe(
      map((data) =>
        'items' in data
          ? {
              ...data,
              items: data.items.map(transformItems),
            }
          : transformItems(data),
      ),
    );
  }
}

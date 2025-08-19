import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { TokenPayload } from '@/common/decorators/token-payload.decorator';
import { JwtPayload } from '@jwt/models/models';
import { JwtAuthorization } from '@/common/decorators/jwt-authorization.decorator';
import { UpdateOrderItemDto } from '@/orders/dto/update-order-item.dto';

@JwtAuthorization()
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createOrder(@TokenPayload() payload: JwtPayload) {
    return await this.ordersService.createOrder(payload);
  }

  //TODO: Implement admin authorization for this endpoint
  @Patch('item/:id')
  async updateOrderItem(
    @Param('id') itemId: string,
    @Body() updateOrderItemDto: UpdateOrderItemDto,
  ) {
    return await this.ordersService.updateOrderItem(itemId, updateOrderItemDto);
  }
}

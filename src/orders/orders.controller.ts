import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { TokenPayload } from '@/common/decorators/token-payload.decorator';
import { JwtPayload } from '@jwt/models/models';
import { JwtAuthorization } from '@/common/decorators/jwt-authorization.decorator';
import { UpdateOrderItemDto } from '@/orders/dto/update-order-item.dto';
import { UpdateOrderDto } from '@/orders/dto/update-order.dto';

@JwtAuthorization()
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  async findMany() {
    return await this.ordersService.findMany();
  }

  @Get(':id')
  async findOne(@Param('id') orderId: string) {
    return await this.ordersService.findOne(orderId);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createOrder(@TokenPayload() payload: JwtPayload) {
    return await this.ordersService.createOrder(payload);
  }

  //TODO: Implement admin authorization for this endpoint
  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  async updateOrder(
    @Param('id') orderId: string,
    @Body() updateOrderDto: UpdateOrderDto,
    @Query('update_items') updateItems?: boolean,
  ) {
    return await this.ordersService.updateOrder(
      orderId,
      updateOrderDto,
      updateItems,
    );
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

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
import {
  OrderArrayResponse,
  OrderResponse,
  ResponseOrderDto,
} from '@/orders/dto/response/response-order.dto';
import { ResponseOrderItemDto } from '@/orders/dto/response/response-order-item.dto';
import { ErrorResponseDto } from '@/common/dto/error-response.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { SerializeResponse } from '@/common/decorators/serialize-response.decorator';
import { CreateOrderDto } from '@/orders/dto/create-order.dto';

@ApiBadRequestResponse({
  description: 'Bad request',
  type: ErrorResponseDto,
})
@ApiBearerAuth('access-token')
@JwtAuthorization()
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @ApiOperation({
    summary: 'Get list of orders',
    description: 'Retrieve a list of orders',
  })
  @ApiOkResponse({
    description: 'List of orders',
    type: OrderArrayResponse,
  })
  @SerializeResponse(ResponseOrderDto)
  @HttpCode(HttpStatus.OK)
  @Get()
  async findMany(): Promise<ResponseOrderDto[]> {
    return await this.ordersService.findManyOrders();
  }

  @ApiOperation({
    summary: 'Get order by ID',
    description: 'Retrieve a specific order by its ID',
  })
  @ApiOkResponse({
    description: 'Order details',
    type: OrderResponse,
  })
  @ApiNotFoundResponse({
    description: 'Order not found',
    type: ErrorResponseDto,
  })
  @SerializeResponse(ResponseOrderDto)
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async findOne(@Param('id') orderId: string): Promise<ResponseOrderDto> {
    return await this.ordersService.findOneOrder(orderId);
  }

  @ApiOperation({
    summary: 'Create a new order',
    description: 'Create a new order for the authenticated user',
  })
  @ApiOperation({
    description: 'Create a new order',
  })
  @ApiCreatedResponse({
    description: 'Created order details',
    type: OrderResponse,
  })
  @SerializeResponse(ResponseOrderDto)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createOrder(
    @TokenPayload() payload: JwtPayload,
    @Body() createOrderDto: CreateOrderDto,
  ): Promise<ResponseOrderDto> {
    return await this.ordersService.createOrder(payload, createOrderDto);
  }

  @ApiOperation({
    summary: 'Update an order',
    description: 'Update order details. Optionally update order items.',
  })
  @ApiOkResponse({
    description: 'Updated order details',
    type: OrderResponse,
  })
  @ApiNotFoundResponse({
    description: 'Order not found',
    type: ErrorResponseDto,
  })
  @SerializeResponse(ResponseOrderDto)
  //TODO: Implement admin authorization for this endpoint
  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  async updateOrder(
    @Param('id') orderId: string,
    @Body() updateOrderDto: UpdateOrderDto,
    @Query('update_items') updateItems?: boolean,
  ): Promise<ResponseOrderDto> {
    return await this.ordersService.updateOrder(
      orderId,
      updateOrderDto,
      updateItems,
    );
  }

  @ApiOperation({
    summary: 'Update an order item',
    description: 'Update details of a specific order item',
  })
  @ApiOkResponse({
    description: 'Updated order item details',
    type: ResponseOrderItemDto,
  })
  @ApiNotFoundResponse({
    description: 'Order item not found',
    type: ErrorResponseDto,
  })
  @SerializeResponse(ResponseOrderItemDto)
  //TODO: Implement admin authorization for this endpoint
  @Patch('item/:id')
  async updateItem(
    @Param('id') itemId: string,
    @Body() updateOrderItemDto: UpdateOrderItemDto,
  ): Promise<ResponseOrderItemDto> {
    return await this.ordersService.updateOrderItem(itemId, updateOrderItemDto);
  }
}

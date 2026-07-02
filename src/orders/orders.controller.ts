import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
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
  OrderResponse,
  OrderArrayResponse,
  ResponseOrderDto,
} from '@/orders/dto/response/response-order.dto';
import {
  OrderItemResponse,
  ResponseOrderItemDto,
} from '@/orders/dto/response/response-order-item.dto';
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
import {
  ManyOrdersQueryDto,
  OneOrderQueryDto,
} from '@/orders/dto/orders-queries.dto';
import { WithPagination } from '@/common/types/pagination';

@ApiBadRequestResponse({
  description: 'Bad request',
  type: ErrorResponseDto,
})
@ApiBearerAuth('access-token')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

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
  @JwtAuthorization()
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createOrder(
    @TokenPayload() payload: JwtPayload,
    @Body() createOrderDto: CreateOrderDto,
  ): Promise<ResponseOrderDto> {
    return await this.ordersService.createOrder(payload, createOrderDto);
  }

  @ApiOperation({
    summary: 'Get list of orders',
    description: 'Retrieve a list of orders',
  })
  @ApiOkResponse({
    description: 'List of orders',
    type: OrderArrayResponse,
  })
  @SerializeResponse(ResponseOrderDto)
  @JwtAuthorization()
  @HttpCode(HttpStatus.OK)
  @Get()
  async findMany(
    @Query() queries: ManyOrdersQueryDto,
  ): Promise<WithPagination<ResponseOrderDto>> {
    return await this.ordersService.findManyOrders(queries);
  }

  @ApiOperation({
    summary: 'Get order by its №',
    description: 'Retrieve a specific order by its №',
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
  @JwtAuthorization()
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) orderNumber: number,
    @Query() queries: OneOrderQueryDto,
  ): Promise<ResponseOrderDto> {
    return await this.ordersService.findOneOrder(orderNumber, queries);
  }

  @ApiOperation({
    summary: 'Update an order (admin only)',
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
  @JwtAuthorization('ADMIN')
  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  async updateOrder(
    @Param('id', ParseIntPipe) orderNumber: number,
    @Body() updateOrderDto: UpdateOrderDto,
  ): Promise<ResponseOrderDto> {
    return await this.ordersService.updateOrder(orderNumber, updateOrderDto);
  }

  @ApiOperation({
    summary: 'Update an order item (admin only)',
    description: 'Update details of a specific order item',
  })
  @ApiOkResponse({
    description: 'Updated order item details',
    type: OrderItemResponse,
  })
  @ApiNotFoundResponse({
    description: 'Order item not found',
    type: ErrorResponseDto,
  })
  @SerializeResponse(ResponseOrderItemDto)
  @JwtAuthorization('ADMIN')
  @HttpCode(HttpStatus.OK)
  @Patch('item/:id')
  async updateItem(
    @Param('id') itemId: string,
    @Body() updateOrderItemDto: UpdateOrderItemDto,
  ): Promise<ResponseOrderItemDto> {
    return await this.ordersService.updateOrderItem(itemId, updateOrderItemDto);
  }
}

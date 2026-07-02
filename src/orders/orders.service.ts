import { CartService } from '@/cart/cart.service';
import { WithPagination } from '@/common/types/pagination';
import { CreateOrderDto } from '@/orders/dto/create-order.dto';
import {
  ManyOrdersQueryDto,
  OneOrderQueryDto,
} from '@/orders/dto/orders-queries.dto';
import { ResponseOrderItemDto } from '@/orders/dto/response/response-order-item.dto';
import { ResponseOrderDto } from '@/orders/dto/response/response-order.dto';
import { UpdateOrderItemDto } from '@/orders/dto/update-order-item.dto';
import { UpdateOrderDto } from '@/orders/dto/update-order.dto';
import { WsEventName, WsOrdersGateway } from '@/ws-orders/ws-orders.gateway';
import { JwtPayload } from '@jwt/models/models';
import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { $Enums, Order, Prisma } from 'generated/prisma';
import {
  Decimal,
  PrismaClientKnownRequestError,
} from 'generated/prisma/runtime/library';

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cartService: CartService,
    private readonly websocket: WsOrdersGateway,
  ) {}

  async findManyOrders({
    userId,
    name,
    phone,
    status,
    from,
    to,
    items,
    product,
    variant,
    number,
    limit = 20,
    page = 1,
  }: ManyOrdersQueryDto): Promise<WithPagination<ResponseOrderDto>> {
    const showItems = items || product || variant;
    const options = {
      where: {
        userId,
        name: name && {
          contains: name,
          mode: 'insensitive',
        },
        orderNumber: number,
        phone,
        status,
        createdAt: {
          gte: from,
          lte: to,
        },
      },
      take: limit,
      skip: (page - 1) * limit,
      orderBy: { createdAt: 'desc' },
      include: {
        items: showItems && {
          include: {
            productVariant: variant && { include: { product } },
          },
        },
      },
    } satisfies Prisma.OrderFindManyArgs;
    try {
      const [data, total] = await Promise.all([
        this.prisma.order.findMany(options),
        this.prisma.order.count({ where: options.where }),
      ]);
      return {
        data,
        pagination: {
          total,
          limit,
          page,
        },
      };
    } catch (error) {
      console.error('Error finding orders:', error);
      throw new BadRequestException('Failed to find orders');
    }
  }

  async findOneOrder(
    orderNumber: number,
    { items, product, variant }: OneOrderQueryDto,
  ): Promise<ResponseOrderDto> {
    try {
      return await this.prisma.order.findUniqueOrThrow({
        where: { orderNumber },
        include: {
          items: items
            ? {
                include: {
                  productVariant: variant
                    ? { include: { product } }
                    : undefined,
                },
              }
            : undefined,
        },
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Order not found');
      }
      console.error('Error finding order:', error);
      throw new BadRequestException('Failed to find order');
    }
  }

  async createOrder(
    payload: JwtPayload,
    { name, address, phone, comment }: CreateOrderDto,
  ): Promise<ResponseOrderDto> {
    const { anonymous, id } = payload;
    if (anonymous && !(name || address || phone)) {
      throw new BadRequestException(
        'Name, address or phone is required for anonymous user',
      );
    }
    const userId = anonymous ? { anonymousUserId: id } : { userId: id };
    const cart = await this.prisma.cart.findUnique({
      where: {
        ...userId,
      },
      include: {
        user: true,
        items: {
          include: {
            productVariant: true,
          },
        },
      },
    });
    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }
    const orderItems = cart.items.map(
      ({ quantity, productVariant, productVariantId }) => ({
        quantity: quantity,
        singleItemPrice: productVariant.price,
        productVariant: { connect: { id: productVariantId } },
        total: productVariant.price.times(quantity),
      }),
    ) satisfies Omit<Prisma.OrderItemCreateInput, 'order'>[];

    const total = orderItems.reduce((sum, item) => {
      const itemTotal = item.singleItemPrice.times(item.quantity);
      return sum.plus(itemTotal);
    }, new Decimal(0));
    try {
      const result = await this.prisma.$transaction(async (prisma) => {
        const newOrder = await prisma.order.create({
          data: {
            total,
            ...userId,
            comment,
            name: cart.user?.name ?? name ?? 'Anonymous',
            address: cart.user?.address ?? address ?? 'No address',
            phone: cart.user?.phone ?? phone ?? 'No phone',
            items: {
              create: orderItems,
            },
          },
        });
        if (!anonymous) {
          await prisma.user.update({
            where: {
              id,
            },
            data: {
              totalSum: {
                increment: new Prisma.Decimal(total),
              },
            },
          });
        }
        await this.cartService.deleteCart(payload, prisma);
        return newOrder;
      });
      this.sendWebSocketMessage('new', result);
      return result;
    } catch {
      throw new BadRequestException('Failed to create order');
    }
  }

  async updateOrder(
    orderNumber: number,
    { status, phone, address, canceledByUser }: UpdateOrderDto,
  ): Promise<ResponseOrderDto> {
    try {
      const updatedOrder = await this.prisma.order.update({
        where: { orderNumber },
        data: {
          status,
          phone,
          address,
          canceledByUser,
        },
      });
      this.sendWebSocketMessage('update', updatedOrder);
      return updatedOrder;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Order not found');
      }
      console.error('Error updating order:', error);
      throw new BadRequestException('Failed to update order');
    }
  }

  async updateOrderItem(
    itemId: string,
    dto: UpdateOrderItemDto,
  ): Promise<ResponseOrderItemDto> {
    try {
      const currentItem = await this.prisma.orderItem.findUniqueOrThrow({
        where: { id: itemId },
        select: {
          quantity: true,
          singleItemPrice: true,
        },
      });
      const singleItemPrice = dto.singleItemPrice
        ? new Prisma.Decimal(dto.singleItemPrice)
        : currentItem.singleItemPrice;
      const { quantity = currentItem.quantity, status } = dto;
      const total = singleItemPrice.times(quantity);
      const result = await this.prisma.orderItem.update({
        where: { id: itemId },
        data: {
          singleItemPrice,
          quantity,
          total,
          status,
        },
      });
      await this.recalculateOrderTotalPrice(result.orderId);
      return result;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Order item not found');
      }
      console.error('Error updating order item:', error);
      throw new BadRequestException('Failed to update order item');
    }
  }

  private async recalculateOrderTotalPrice(
    orderId: Order['id'],
  ): Promise<ResponseOrderDto> {
    const { items } = await this.prisma.order.findUniqueOrThrow({
      where: { id: orderId },
      select: {
        items: {
          select: {
            total: true,
            status: true,
          },
        },
      },
    });
    const total = items.reduce(
      (sum, item) =>
        item.status === $Enums.OrderStatus.CANCELED
          ? sum
          : sum.plus(item.total),
      new Decimal(0),
    );
    const updatedOrder = await this.prisma.order.update({
      where: { id: orderId },
      data: { total },
    });
    this.sendWebSocketMessage('update', updatedOrder);
    return updatedOrder;
  }

  private sendWebSocketMessage(event: WsEventName, order: ResponseOrderDto) {
    this.websocket.sendMessage(event, order);
  }
}

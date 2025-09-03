import { CartService } from '@/cart/cart.service';
import { CreateOrderDto } from '@/orders/dto/create-order.dto';
import {
  ManyOrdersQueryDto,
  OneOrderQueryDto,
} from '@/orders/dto/orders-queries.dto';
import { ResponseOrderItemDto } from '@/orders/dto/response/response-order-item.dto';
import {
  OrderWithItemsResponseDto,
  ResponseOrderDto,
} from '@/orders/dto/response/response-order.dto';
import { UpdateOrderItemDto } from '@/orders/dto/update-order-item.dto';
import { UpdateOrderDto } from '@/orders/dto/update-order.dto';
import { JwtPayload } from '@jwt/models/models';
import {
  BadRequestException,
  HttpCode,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  Post,
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
  ) {}

  async findManyOrders({
    userId,
    name,
    phone,
    status,
    showAll,
    from,
    to,
    items,
    product,
    variant,
  }: ManyOrdersQueryDto): Promise<OrderWithItemsResponseDto[]> {
    return await this.prisma.order.findMany({
      where: {
        userId,
        name: name
          ? {
              contains: name,
              mode: 'insensitive',
            }
          : undefined,
        phone,
        status: showAll
          ? undefined
          : status
            ? status
            : {
                not: {
                  equals: 'CANCELED',
                },
              },
        createdAt: {
          gte: from,
          lte: to,
        },
      },
      include: {
        items: items
          ? {
              include: {
                productVariant: variant ? { include: { product } } : undefined,
              },
            }
          : undefined,
      },
    });
  }

  async findOneOrder(
    orderId: string,
    { items, product, variant }: OneOrderQueryDto,
  ): Promise<OrderWithItemsResponseDto> {
    try {
      return await this.prisma.order.findUniqueOrThrow({
        where: { id: String(orderId) },
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

  @HttpCode(HttpStatus.CREATED)
  @Post()
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
      const newOrder = await this.prisma.order.create({
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
      await this.cartService.deleteCart(payload);
      return newOrder;
    } catch {
      throw new BadRequestException('Failed to create order');
    }
  }

  async updateOrder(
    orderId: string,
    { status, phone, address }: UpdateOrderDto,
    updateItems = false,
  ): Promise<ResponseOrderDto> {
    return await this.prisma.order.update({
      where: { id: orderId },
      data: {
        status,
        phone,
        address,
        items: updateItems
          ? {
              updateMany: {
                where: {
                  orderId,
                },
                data: { status },
              },
            }
          : undefined,
      },
    });
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
      const {
        quantity = currentItem.quantity,
        singleItemPrice = currentItem.singleItemPrice,
        status,
      } = dto;
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

  private async recalculateOrderTotalPrice(orderId: Order['id']) {
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
    return await this.prisma.order.update({
      where: { id: orderId },
      data: { total },
    });
  }
}

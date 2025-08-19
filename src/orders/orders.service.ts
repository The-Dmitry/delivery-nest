import { UpdateOrderItemDto } from '@/orders/dto/update-order-item.dto';
import { JwtPayload } from '@jwt/models/models';
import {
  BadRequestException,
  HttpCode,
  HttpException,
  HttpStatus,
  Injectable,
  Post,
} from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { Order, Prisma } from 'generated/prisma';
import {
  Decimal,
  PrismaClientKnownRequestError,
} from 'generated/prisma/runtime/library';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createOrder({
    anonymous,
    id,
  }: JwtPayload): Promise<Pick<Order, 'orderNumber'>> {
    const userId = anonymous ? { anonymousUserId: id } : { userId: id };
    const cart = await this.prisma.cart.findUnique({
      where: {
        ...userId,
      },
      include: {
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
      return await this.prisma.order.create({
        data: {
          total,
          ...userId,
          items: {
            create: orderItems,
          },
        },
        select: {
          orderNumber: true,
        },
      });
    } catch {
      throw new BadRequestException('Failed to create order');
    }
  }

  async updateOrderItem(itemId: string, dto: UpdateOrderItemDto) {
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
      return await this.prisma.orderItem.update({
        where: { id: itemId },
        data: {
          singleItemPrice,
          quantity,
          total,
          status,
        },
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new BadRequestException('Order item not found');
      }
      console.error('Error updating order item:', error);
      throw new BadRequestException('Failed to update order item');
    }
  }

  // private async recalculateItemTotalPrice() {

  // }
}
